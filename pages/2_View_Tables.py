"""
BankSight - View Tables Explorer
Page 2: High-performance table inspection with schema diagnostics, search, sorting & CSV export.
"""

import streamlit as st
import pandas as pd
from helpers import inject_custom_css, run_query, load_table, get_table_count, format_number
from components.sidebar import render_sidebar

st.set_page_config(
    page_title="View Tables | BankSight",
    page_icon="📄",
    layout="wide"
)

inject_custom_css()
render_sidebar()

st.markdown("""
<div style="margin-bottom: 1.2rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 1rem;">
    <h1 style="font-size: 2rem; font-weight: 800; margin: 0; color: #1e3a8a;">
        Database Tables Explorer
    </h1>
    <p style="color: #64748b; margin: 0.3rem 0 0 0; font-size: 0.95rem;">
        Browse all 8 MySQL database tables, view columns, inspect records, and download raw CSV datasets.
    </p>
</div>

<!-- 💡 3-Step Simple How-To-Use Guide -->
<div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 0.9rem 1.4rem; margin-bottom: 1.5rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.2rem; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
    <div style="display: flex; align-items: center; gap: 0.85rem;">
        <div style="background: #eff6ff; color: #1d4ed8; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; flex-shrink: 0; border: 2px solid #bfdbfe;">1</div>
        <div>
            <strong style="color: #0f172a; font-size: 0.86rem; display: block;">Step 1: Pick a Table</strong>
            <span style="color: #64748b; font-size: 0.76rem;">Select any database table from the dropdown below.</span>
        </div>
    </div>
    <div style="display: flex; align-items: center; gap: 0.85rem;">
        <div style="background: #eff6ff; color: #1d4ed8; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; flex-shrink: 0; border: 2px solid #bfdbfe;">2</div>
        <div>
            <strong style="color: #0f172a; font-size: 0.86rem; display: block;">Step 2: Browse Rows</strong>
            <span style="color: #64748b; font-size: 0.76rem;">View total row counts, column data types, and primary keys.</span>
        </div>
    </div>
    <div style="display: flex; align-items: center; gap: 0.85rem;">
        <div style="background: #f0fdf4; color: #15803d; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; flex-shrink: 0; border: 2px solid #86efac;">3</div>
        <div>
            <strong style="color: #0f172a; font-size: 0.86rem; display: block;">Step 3: Download CSV</strong>
            <span style="color: #64748b; font-size: 0.76rem;">Click the download button to export the entire table to Excel.</span>
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

# Table Selection
table_options = [
    "customers",
    "accounts",
    "transactions",
    "loans",
    "credit_cards",
    "branches",
    "support_tickets"
]

tbl_col1, tbl_col2, tbl_col3 = st.columns([1.5, 1, 1])

with tbl_col1:
    selected_table = st.selectbox("Select Database Table", table_options, index=0)

total_rows = get_table_count(selected_table)

with tbl_col2:
    page_size = st.selectbox("Rows per page", [20, 50, 100, 200, 500], index=1)

# Schema Details Card (White & Blue)
schema_info = run_query(f"DESCRIBE `{selected_table}`")

st.markdown(f"""
<div style="display: flex; gap: 1rem; margin-bottom: 1.2rem; flex-wrap: wrap;">
    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-top: 3px solid #2563eb; border-radius: 10px; padding: 0.75rem 1.2rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); min-width: 140px;">
        <span style="font-size: 0.72rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Total Records</span>
        <div style="font-size: 1.35rem; font-weight: 800; color: #2563eb;">{format_number(total_rows)}</div>
    </div>
    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-top: 3px solid #16a34a; border-radius: 10px; padding: 0.75rem 1.2rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); min-width: 140px;">
        <span style="font-size: 0.72rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Columns</span>
        <div style="font-size: 1.35rem; font-weight: 800; color: #16a34a;">{len(schema_info)}</div>
    </div>
    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-top: 3px solid #0284c7; border-radius: 10px; padding: 0.75rem 1.2rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); min-width: 180px;">
        <span style="font-size: 0.72rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Database Entity</span>
        <div style="font-size: 1.15rem; font-weight: 800; color: #1e293b;">banksight.{selected_table}</div>
    </div>
</div>
""", unsafe_allow_html=True)

# Search & Pagination Controls
search_query = st.text_input(f"🔍 Search within `{selected_table}` (searches across all text columns)", "")

# Pagination math
total_pages = max(1, (total_rows + page_size - 1) // page_size)
with tbl_col3:
    current_page = st.number_input("Page Number", min_value=1, max_value=total_pages, value=1, step=1)

offset = (current_page - 1) * page_size

# Load Data
if search_query:
    # Build text search query across character/varchar columns
    text_cols = [row["Field"] for _, row in schema_info.iterrows() if "char" in row["Type"].lower() or "text" in row["Type"].lower()]
    if text_cols:
        search_clauses = [f"`{col}` LIKE %s" for col in text_cols]
        where_search = " OR ".join(search_clauses)
        params = [f"%{search_query}%"] * len(text_cols)
        df_display = run_query(f"SELECT * FROM `{selected_table}` WHERE {where_search} LIMIT %s OFFSET %s", params + [page_size, offset])
        count_df = run_query(f"SELECT COUNT(*) AS cnt FROM `{selected_table}` WHERE {where_search}", params)
        search_matches = count_df['cnt'].iloc[0] if not count_df.empty else len(df_display)
        st.caption(f"Showing {len(df_display)} of {search_matches} search results matching '{search_query}'.")
    else:
        df_display = load_table(selected_table, limit=page_size, offset=offset)
else:
    df_display = load_table(selected_table, limit=page_size, offset=offset)

# Display Table
st.dataframe(df_display, use_container_width=True, hide_index=True)

# Export Controls
exp_c1, exp_c2 = st.columns([1, 4])
with exp_c1:
    if not df_display.empty:
        csv_data = df_display.to_csv(index=False).encode('utf-8')
        st.download_button(
            label="⬇️ Export Current Page (CSV)",
            data=csv_data,
            file_name=f"{selected_table}_page_{current_page}.csv",
            mime="text/csv",
            use_container_width=True
        )

# Schema Structure Expander
with st.expander(f"📋 View Schema & Column Definitions for `{selected_table}`"):
    st.dataframe(schema_info, use_container_width=True, hide_index=True)
