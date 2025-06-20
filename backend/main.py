
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import re
import html2text
import numpy as np
from sentence_transformers import SentenceTransformer, util
import diff_match_patch as dmp_module
from typing import List

app = FastAPI(title="Email Comparison API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ComparisonRequest(BaseModel):
    originalDocument: str
    dateTimeFormat: str
    marker: str
    htmlBodyContent: str
    currentUrl: str
    timestamp: str

class ComparisonResponse(BaseModel):
    success: bool
    html_output: str
    message: str

# Your exact Python logic - unchanged
def extract_clauses_from_text(text):
    lines = text.splitlines()
    clauses = []
    current_clause = ""

    # Match lines starting with C1, c2, C3. etc. (but not C1a or C1.1)
    clause_start_pattern = re.compile(r'^(c\d+)\.?\s+(.*)', re.IGNORECASE)

    for line in lines:
        line = line.strip()
        if not line:
            continue

        match = clause_start_pattern.match(line)
        if match:
            # New clause found
            if current_clause:
                clauses.append(current_clause.strip())
            current_clause = f"{match.group(1).upper()}. {match.group(2)}".strip()
        else:
            # Continuation of previous clause
            current_clause += " " + line

    if current_clause:
        clauses.append(current_clause.strip())

    return clauses

def alpha_end_all_lines(text):
    lines = text.splitlines()
    # Add alpha to the end of every line, even if blank
    lines_with_alpha = [line + 'α' for line in lines]
    return '\n'.join(lines_with_alpha)

def extract_with_html2text(html):
    handler = html2text.HTML2Text()
    handler.ignore_links = True
    handler.ignore_emphasis = True      # No * or _ for bold/italic
    handler.ignore_images = True
    handler.body_width = 0              # No forced line breaks
    handler.single_line_break = True    # Fewer double breaks
    handler.unicode_snob = True         # Use unicode chars where possible
    text = handler.handle(html)
    text = text.replace('|', '').replace('~', '').replace('-', '')
    return text

def extract_between_markers_from_html(html, start_marker, end_marker):
    plain_text = extract_with_html2text(html)

    start_idx = plain_text.find(start_marker)
    end_idx = plain_text.find(end_marker)

    # Ensure both markers exist and are in order
    if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
        return plain_text[start_idx + len(start_marker):end_idx]
    elif start_idx != -1:
        return plain_text[start_idx + len(start_marker):]
    elif end_idx != -1:
        return plain_text[:end_idx]
    else:
        return plain_text  # fallback: full text

def normalize_whitespace(text):
    return re.sub(r'\s+', ' ', text).strip()

def convert_diff_to_html(diff):
    html_output = ""
    for op, data in diff:
        if op == dmp_module.diff_match_patch.DIFF_INSERT:
            html_output += f'&nbsp<span style="color:red;text-decoration:line-through;">{data}</span>'
        elif op == dmp_module.diff_match_patch.DIFF_DELETE:
            html_output += f'<span style="color:red;">{data}</span>'
        else:
            html_output += f'<span>{data}</span>'
    return html_output

def compare_clauses_sequentially(original_clauses, revised_clauses, window=3, threshold=0.5):
    if not original_clauses:
        return []
    if not revised_clauses:
        return [f"<div style='color:red;'>{normalize_whitespace(c)}</div>" for c in original_clauses]

    # Load model
    model = SentenceTransformer("mixedbread-ai/mxbai-embed-large-v1")

    dmp = dmp_module.diff_match_patch()

    # Normalize all clauses once
    original_clauses = [normalize_whitespace(c) for c in original_clauses]
    revised_clauses = [normalize_whitespace(c) for c in revised_clauses]

    # Precompute all embeddings (batch)
    original_embeddings = model.encode(original_clauses, batch_size=64, show_progress_bar=True)
    revised_embeddings = model.encode(revised_clauses, batch_size=64, show_progress_bar=True)

    used_revised = set()
    output_html = [""] * max(len(original_clauses), len(revised_clauses))

    for i, orig_emb in enumerate(original_embeddings):
        start = max(0, i - window)
        end = min(len(revised_embeddings), i + window + 1)

        candidate_embeddings = revised_embeddings[start:end]
        sims = util.cos_sim(orig_emb, candidate_embeddings)[0]
        best_idx = int(np.argmax(sims))
        best_score = float(sims[best_idx])
        actual_rev_idx = start + best_idx

        if best_score > threshold and actual_rev_idx not in used_revised:
            diffs = dmp.diff_main(original_clauses[i], revised_clauses[actual_rev_idx])
            dmp.diff_cleanupSemantic(diffs)
            html_result = convert_diff_to_html(diffs)
            output_html[i] = f"<div style='font-family:Courier; font-size:15px; white-space:pre-wrap;'>{html_result}</div>"
            used_revised.add(actual_rev_idx)
        else:
            output_html[i] = f"<div style='font-family:Courier; font-size:15px; white-space:pre-wrap; color:red;'>{original_clauses[i]}</div>"

    # Add unmatched revised clauses
    for idx, clause in enumerate(revised_clauses):
        if idx not in used_revised:
            red_strike = f"<div style='font-family:Courier; font-size:15px; white-space:pre-wrap; color:red;text-decoration:line-through;'>{clause}</div>"
            if idx < len(output_html) and output_html[idx] == "":
                output_html[idx] = red_strike
            else:
                output_html.append(red_strike)

    return output_html

def format_clause_html(html_text):
    # Handle α → single line break
    html_text = html_text.replace('α', '<br>')
    return html_text

def display_comparison_results(comparison_results):
    full_html = "<html><body style='font-family:Courier; font-size:15px; white-space:pre-wrap;'>"
    full_html += "".join(format_clause_html(clause_html) for clause_html in comparison_results)
    full_html += "</body></html>"
    return full_html

@app.post("/compare", response_model=ComparisonResponse)
async def compare_documents(request: ComparisonRequest):
    try:
        # Process original text with your exact logic
        original_text = request.originalDocument
        original_text = alpha_end_all_lines(original_text)
        original_clauses = extract_clauses_from_text(original_text)
        
        # Extract relevant text from HTML using your exact logic
        your_html_content = request.htmlBodyContent
        initial_marker = request.dateTimeFormat
        final_marker = request.marker
        
        relevant_text = extract_between_markers_from_html(your_html_content, initial_marker, final_marker)
        revised_clauses = extract_clauses_from_text(relevant_text)
        
        # Calculate window using your exact logic
        window = int(abs(len(revised_clauses) - len(original_clauses)) * 1.5 + 5)
        
        # Compare clauses using your exact logic
        comparison_results = compare_clauses_sequentially(original_clauses, revised_clauses, window)
        
        # Format final HTML using your exact logic
        final_html = display_comparison_results(comparison_results)
        
        return ComparisonResponse(
            success=True,
            html_output=final_html,
            message=f"Comparison completed successfully. Processed {len(original_clauses)} original clauses and {len(revised_clauses)} revised clauses."
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Email Comparison API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
