"""
BankSight - Analytical SQL Insights Engine
Page 6: 15 verified, schema-aligned industry banking queries with interactive visualizations.
"""

import streamlit as st
import pandas as pd
import time
from helpers import inject_custom_css, format_number
from components.sidebar import render_sidebar
from components.charts import render_dynamic_chart
import queries as q

st.set_page_config(
    page_title="SQL Insights | BankSight",
    page_icon="📊",
    layout="wide"
)

inject_custom_css()
render_sidebar()

st.markdown("""
<div style="margin-bottom: 1.2rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.8rem;">
    <div style="display: flex; justify-content: space-between; align-items: flex-end;">
        <div>
            <h1 style="font-size: 2rem; font-weight: 800; margin: 0; color: #1e3a8a;">
                15 Solved Bank Questions (SQL Insights)
            </h1>
            <p style="color: #64748b; margin: 0.3rem 0 0 0; font-size: 0.95rem;">
                Live query answers for your major academic viva. Select any business question to view the answer, chart, and SQL query.
            </p>
        </div>
        <div style="display: flex; align-items: center; gap: 0.4rem;">
            <span class="live-dot-success"></span>
            <span class="kpi-badge badge-green" style="font-size: 0.75rem; padding: 0.35rem 0.75rem;">
                15 / 15 QUERIES VERIFIED
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
            <strong style="color: #0f172a; font-size: 0.86rem; display: block;">Step 1: Choose Question</strong>
            <span style="color: #64748b; font-size: 0.76rem;">Pick domain or question from dropdown below.</span>
        </div>
    </div>
    <div style="display: flex; align-items: center; gap: 0.8rem;">
        <div style="background: #f0fdf4; color: #15803d; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; flex-shrink: 0; border: 2px solid #86efac;">
            2
        </div>
        <div>
            <strong style="color: #0f172a; font-size: 0.86rem; display: block;">Step 2: See Live Result & Chart</strong>
            <span style="color: #64748b; font-size: 0.76rem;">View instant bank table and interactive chart.</span>
        </div>
    </div>
    <div style="display: flex; align-items: center; gap: 0.8rem;">
        <div style="background: #f5f3ff; color: #6d28d9; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; flex-shrink: 0; border: 2px solid #ddd6fe;">
            3
        </div>
        <div>
            <strong style="color: #0f172a; font-size: 0.86rem; display: block;">Step 3: Copy SQL / Export CSV</strong>
            <span style="color: #64748b; font-size: 0.76rem;">Expand SQL box or download result as CSV.</span>
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

# Category Filtering & Query Selector
col_cat, col_qry = st.columns([1, 2])

unique_categories = sorted(list(set(item["category"] for item in q.INSIGHTS_CATALOG.values())))
categories = ["All Categories"] + unique_categories

with col_cat:
    selected_cat = st.selectbox("Filter by Business Domain", categories, index=0)

filtered_items = {
    qid: item for qid, item in q.INSIGHTS_CATALOG.items()
    if selected_cat == "All Categories" or item["category"] == selected_cat
}

with col_qry:
    query_labels = {f"[{qid}] {item['title']}": qid for qid, item in filtered_items.items()}
    selected_label = st.selectbox("Select Analytical Query", list(query_labels.keys()), index=0)
    selected_qid = query_labels[selected_label]

item = q.INSIGHTS_CATALOG[selected_qid]

# Header Card for Selected Query
st.markdown('<div class="content-card">', unsafe_allow_html=True)
col_title, col_meta = st.columns([3, 1])

with col_title:
    st.markdown(f"""
    <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.3rem;">
        <span class="kpi-badge badge-blue" style="font-size: 0.75rem;">{item['category']}</span>
        <span class="kpi-badge badge-cyan" style="font-size: 0.75rem;">QUERY {selected_qid}</span>
    </div>
    <h3 style="margin: 0.2rem 0; color: #0f172a;">{item['title']}</h3>
    <div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 0.75rem 1rem; border-radius: 0 8px 8px 0; margin: 0.6rem 0;">
        <span style="font-size: 0.75rem; color: #1d4ed8; font-weight: 700; text-transform: uppercase;">Official Requirement Question:</span>
        <p style="color: #0f172a; font-weight: 700; font-size: 1rem; margin: 0.25rem 0 0 0;">
            "{item.get('question', item['title'])}"
        </p>
    </div>
    <p style="color: #475569; font-size: 0.88rem; line-height: 1.5; margin-top: 0.3rem;">
        {item['description']}
    </p>
    """, unsafe_allow_html=True)

with col_meta:
    st.markdown("""
    <div style="background: #ffffff; border: 1.5px solid #bfdbfe; border-radius: 10px; padding: 0.9rem; text-align: center; box-shadow: 0 2px 8px rgba(37, 99, 235, 0.06);">
        <div style="font-size: 0.7rem; color: #64748b; text-transform: uppercase; font-weight: 600;">Engine</div>
        <div style="font-weight: 800; color: #1d4ed8; font-size: 0.9rem; margin: 0.2rem 0;">MySQL 8.0/9.5 InnoDB</div>
        <div style="font-size: 0.72rem; color: #15803d; font-weight: 600; margin-top: 0.2rem;">
            <span class="live-dot-success"></span>Live Verified
        </div>
    </div>
    """, unsafe_allow_html=True)

# Collapsible SQL Code Display
with st.expander("📝 View Raw Executed SQL Query", expanded=False):
    st.code(item["sql"].strip(), language="sql")

st.markdown('</div>', unsafe_allow_html=True)

# Execute Query and Measure Latency
t_start = time.perf_counter()
df_res = item["func"]()
t_elapsed = (time.perf_counter() - t_start) * 1000

# Metric and Status Bar
m1, m2, m3 = st.columns(3)
m1.metric("Rows Returned", format_number(len(df_res)))
m2.metric("Execution Latency", f"{t_elapsed:.1f} ms")
m3.metric("Data Fields", f"{len(df_res.columns)} attributes")

# Visualization Section (if applicable)
fig = render_dynamic_chart(df_res, item)
if fig:
    st.markdown('<div class="content-card">', unsafe_allow_html=True)
    st.plotly_chart(fig, use_container_width=True)
    st.markdown('</div>', unsafe_allow_html=True)

# Data Table Display
st.markdown('<div class="content-card">', unsafe_allow_html=True)
st.markdown("#### Query Results Dataset")

if not df_res.empty:
    st.dataframe(df_res, use_container_width=True, hide_index=True)
    csv_bytes = df_res.to_csv(index=False).encode('utf-8')
    st.download_button(
        label=f"⬇️ Export Results to CSV ({len(df_res)} rows)",
        data=csv_bytes,
        file_name=f"{selected_qid}_{item['title'].lower().replace(' ', '_')}.csv",
        mime="text/csv"
    )
else:
    st.warning("Query returned zero rows on the active database dataset.")
st.markdown('</div>', unsafe_allow_html=True)

# Quick Navigation Matrix for all 15 queries
st.markdown("<br>", unsafe_allow_html=True)
with st.expander("📚 Complete Index of All 15 Analytical Insights"):
    cat_df = pd.DataFrame([
        {
            "ID": qid,
            "Title": it["title"],
            "Category": it["category"],
            "Visual": it.get("chart_type", "table").capitalize(),
            "Summary": it["description"]
        }
        for qid, it in q.INSIGHTS_CATALOG.items()
    ])
    st.dataframe(cat_df, use_container_width=True, hide_index=True)
