"""
BankSight - Multi-Dimensional Data Filtering
Page 3: Interactive multi-level query filters, numeric ranges, categorical subsets, and summary analytics.
"""

import streamlit as st
import pandas as pd
from helpers import inject_custom_css, load_table, format_number, format_currency
from components.sidebar import render_sidebar

st.set_page_config(
    page_title="Filter Data | BankSight",
    page_icon="🔍",
    layout="wide"
)

inject_custom_css()
render_sidebar()

st.markdown("""
<div style="margin-bottom: 1.2rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.8rem;">
    <div style="display: flex; justify-content: space-between; align-items: flex-end;">
        <div>
            <h1 style="font-size: 2rem; font-weight: 800; margin: 0; color: #1e3a8a;">
                Search & Filter Bank Data
            </h1>
            <p style="color: #64748b; margin: 0.3rem 0 0 0; font-size: 0.95rem;">
                Easily search and slice any banking table using multiple filters at the same time.
            </p>
        </div>
        <div style="display: flex; align-items: center; gap: 0.4rem;">
            <span class="live-dot-success"></span>
            <span class="kpi-badge badge-blue" style="font-size: 0.75rem; padding: 0.35rem 0.75rem;">
                MULTI-COLUMN SEARCH
            </span>
        </div>
    </div>
</div>

<!-- 💡 3-Step Simple How-To-Use Guide -->
<div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 0.9rem 1.4rem; margin-bottom: 1.5rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
    <div style="display: flex; align-items: center; gap: 0.8rem;">
        <div style="background: #eff6ff; color: #1d4ed8; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; flex-shrink: 0; border: 2px solid #bfdbfe;">
            1
        </div>
        <div>
            <strong style="color: #0f172a; font-size: 0.86rem; display: block;">Step 1: Choose Table</strong>
            <span style="color: #64748b; font-size: 0.76rem;">Select Customers, Accounts, Loans, etc.</span>
        </div>
    </div>
    <div style="display: flex; align-items: center; gap: 0.8rem;">
        <div style="background: #f0fdf4; color: #15803d; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; flex-shrink: 0; border: 2px solid #86efac;">
            2
        </div>
        <div>
            <strong style="color: #0f172a; font-size: 0.86rem; display: block;">Step 2: Apply Filters</strong>
            <span style="color: #64748b; font-size: 0.76rem;">Filter by city, balance range, type, or date.</span>
        </div>
    </div>
    <div style="display: flex; align-items: center; gap: 0.8rem;">
        <div style="background: #f5f3ff; color: #6d28d9; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; flex-shrink: 0; border: 2px solid #ddd6fe;">
            3
        </div>
        <div>
            <strong style="color: #0f172a; font-size: 0.86rem; display: block;">Step 3: Export CSV</strong>
            <span style="color: #64748b; font-size: 0.76rem;">Download the filtered rows directly to Excel.</span>
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

# Select dataset
dataset_col, limit_col = st.columns([3, 1])

with dataset_col:
    dataset_name = st.selectbox(
        "Select Banking Dataset to Filter",
        ["customers", "accounts", "transactions", "loans", "credit_cards", "branches", "support_tickets"],
        index=0
    )

with limit_col:
    sample_limit = st.selectbox("Sample Size", [1000, 2500, 5000, 10000], index=1)

# Load dataset
df_raw = load_table(dataset_name, limit=sample_limit)

if df_raw.empty:
    st.warning(f"No records found in '{dataset_name}'.")
    st.stop()

# Multi-Column Filter Builder
st.markdown('<div class="content-card">', unsafe_allow_html=True)
st.markdown("#### ⚙️ Configure Multi-Level Filters")

all_columns = list(df_raw.columns)

# Default columns to suggest for quick filtering
default_filters = []
if dataset_name == "customers":
    default_filters = [c for c in ["city", "account_type", "age"] if c in all_columns]
elif dataset_name == "transactions":
    default_filters = [c for c in ["txn_type", "status", "amount"] if c in all_columns]
elif dataset_name == "loans":
    default_filters = [c for c in ["Loan_Type", "Loan_Status", "Loan_Amount"] if c in all_columns]
elif dataset_name == "accounts":
    default_filters = [c for c in ["account_balance"] if c in all_columns]
else:
    default_filters = all_columns[:2]

selected_filter_cols = st.multiselect(
    "Choose one or more columns to filter simultaneously:",
    options=all_columns,
    default=default_filters,
    help="Select multiple columns to apply combined AND conditions across all chosen attributes."
)

filtered_df = df_raw.copy()
active_filters_count = 0

if selected_filter_cols:
    st.markdown("<hr style='border-color: rgba(56, 189, 248, 0.15); margin: 1rem 0;'>", unsafe_allow_html=True)
    filter_grid_cols = st.columns(min(len(selected_filter_cols), 3))

    for idx, col in enumerate(selected_filter_cols):
        target_grid_col = filter_grid_cols[idx % len(filter_grid_cols)]
        col_series = df_raw[col]
        is_numeric = pd.api.types.is_numeric_dtype(col_series)
        unique_vals = col_series.dropna().unique()
        is_categorical = (len(unique_vals) <= 30 and not is_numeric) or (len(unique_vals) <= 12)

        with target_grid_col:
            st.markdown(f"**Filter: `{col}`**")
            if is_numeric:
                min_v = float(col_series.min()) if pd.notna(col_series.min()) else 0.0
                max_v = float(col_series.max()) if pd.notna(col_series.max()) else 100.0
                step_val = 1.0 if max_v - min_v > 10 else 0.1
                if min_v == max_v:
                    st.info(f"Fixed value: {min_v}")
                else:
                    slider_val = st.slider(
                        f"Range for {col}",
                        min_value=min_v,
                        max_value=max_v,
                        value=(min_v, max_v),
                        step=step_val,
                        key=f"slider_{col}"
                    )
                    if slider_val != (min_v, max_v):
                        filtered_df = filtered_df[(filtered_df[col] >= slider_val[0]) & (filtered_df[col] <= slider_val[1])]
                        active_filters_count += 1
            elif is_categorical:
                sorted_cats = sorted(list(unique_vals), key=lambda x: str(x))
                selected_cats = st.multiselect(
                    f"Categories for {col}",
                    options=sorted_cats,
                    default=sorted_cats,
                    key=f"cat_{col}"
                )
                if len(selected_cats) < len(sorted_cats):
                    filtered_df = filtered_df[filtered_df[col].isin(selected_cats)]
                    active_filters_count += 1
            else:
                search_txt = st.text_input(
                    f"Search text in {col}",
                    value="",
                    key=f"txt_{col}",
                    placeholder="Enter substring..."
                )
                if search_txt.strip():
                    filtered_df = filtered_df[filtered_df[col].astype(str).str.contains(search_txt.strip(), case=False, na=False)]
                    active_filters_count += 1

st.markdown('</div>', unsafe_allow_html=True)

# Summary Metric Banner
total_recs = len(df_raw)
match_recs = len(filtered_df)
pct_match = (match_recs / total_recs) * 100 if total_recs > 0 else 0

m_col1, m_col2, m_col3, m_col4 = st.columns(4)
with m_col1:
    st.metric("Filtered Matches", format_number(match_recs), f"{pct_match:.1f}% match")
with m_col2:
    st.metric("Total Records In Scope", format_number(total_recs))
with m_col3:
    st.metric("Active Filters Applied", f"{active_filters_count} columns")
with m_col4:
    amt_cols = [c for c in filtered_df.columns if any(k in c.lower() for k in ["amount", "balance", "revenue", "limit"])]
    if amt_cols:
        sum_val = filtered_df[amt_cols[0]].sum()
        st.metric(f"Sum of {amt_cols[0]}", format_currency(sum_val))
    else:
        st.metric("Total Columns", f"{len(filtered_df.columns)}")

# Results Section
st.markdown('<div class="content-card">', unsafe_allow_html=True)
header_left, header_right = st.columns([3, 1])

with header_left:
    st.markdown(f"#### 📋 Filtered Results: `{dataset_name}` ({format_number(match_recs)} records)")
with header_right:
    if not filtered_df.empty:
        csv_bytes = filtered_df.to_csv(index=False).encode('utf-8')
        st.download_button(
            label=f"⬇️ Export Filtered CSV ({match_recs})",
            data=csv_bytes,
            file_name=f"filtered_{dataset_name}.csv",
            mime="text/csv",
            use_container_width=True
        )

st.dataframe(filtered_df, use_container_width=True, hide_index=True)
st.markdown('</div>', unsafe_allow_html=True)
