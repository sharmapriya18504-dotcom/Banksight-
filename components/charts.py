"""
BankSight Plotly Visualizations Engine
Generates high-fidelity, interactive white and blue charts with green success and red stop indicators.
"""

import plotly.express as px
import plotly.graph_objects as go
import pandas as pd

# Standard Theme Configuration (White & Blue Financial Theme)
THEME_FONT = "Plus Jakarta Sans, sans-serif"
COLOR_PALETTE = ["#2563eb", "#16a34a", "#0284c7", "#f59e0b", "#dc2626", "#7c3aed", "#0891b2", "#ea580c"]

def apply_dark_theme(fig, title=None, height=380):
    """
    Applies unified white-and-blue financial styling, crisp slate gridlines, and dark navy typography.
    Retains function name for seamless backward compatibility across all dashboard pages.
    """
    fig.update_layout(
        template="plotly_white",
        paper_bgcolor="#ffffff",
        plot_bgcolor="#ffffff",
        font=dict(family=THEME_FONT, color="#334155", size=12),
        title=dict(
            text=f"<b>{title}</b>" if title else None,
            font=dict(size=14, color="#0f172a", family=THEME_FONT),
            x=0.02,
            y=0.96
        ),
        margin=dict(l=40, r=40, t=55 if title else 25, b=40),
        height=height,
        hoverlabel=dict(
            bgcolor="#ffffff",
            font_size=12,
            font_family=THEME_FONT,
            font_color="#0f172a",
            bordercolor="#2563eb"
        ),
        legend=dict(
            orientation="h",
            yanchor="bottom",
            y=1.02,
            xanchor="right",
            x=1,
            font=dict(size=11, color="#334155")
        )
    )
    fig.update_xaxes(
        showgrid=True,
        gridwidth=1,
        gridcolor="#f1f5f9",
        linecolor="#e2e8f0",
        zeroline=False,
        tickfont=dict(size=11, color="#64748b")
    )
    fig.update_yaxes(
        showgrid=True,
        gridwidth=1,
        gridcolor="#f1f5f9",
        linecolor="#e2e8f0",
        zeroline=False,
        tickfont=dict(size=11, color="#64748b")
    )
    return fig

# Alias for clarity
apply_fintech_theme = apply_dark_theme

def chart_monthly_trends(df: pd.DataFrame):
    """Monthly transaction volume (Royal Blue) and success rate (Emerald Green) dual-axis chart."""
    if df.empty:
        return go.Figure()

    fig = go.Figure()

    # Volume Bar (Royal Blue)
    fig.add_trace(go.Bar(
        x=df["txn_month"],
        y=df["total_volume"],
        name="Total Volume (₹)",
        marker=dict(
            color="#2563eb",
            line=dict(color="#1d4ed8", width=1.5)
        ),
        opacity=0.9,
        hovertemplate="<b>%{x}</b><br>Volume: ₹%{y:,.2f}<extra></extra>"
    ))

    # Success Rate Line (Emerald Green for Success!)
    if "success_rate_pct" in df.columns:
        fig.add_trace(go.Scatter(
            x=df["txn_month"],
            y=df["success_rate_pct"],
            name="Success Rate (%) [LIVE]",
            yaxis="y2",
            mode="lines+markers",
            line=dict(color="#16a34a", width=3),
            marker=dict(size=7, color="#16a34a", symbol="circle", line=dict(color="#ffffff", width=1.5)),
            hovertemplate="<b>%{x}</b><br>Success Rate: %{y:.1f}%<extra></extra>"
        ))

    fig = apply_fintech_theme(fig, title="Monthly Transaction Volume & Success Rate Trend")
    fig.update_layout(
        yaxis=dict(title=dict(text="Volume (₹)", font=dict(color="#2563eb"))),
        yaxis2=dict(
            title=dict(text="Success Rate (%)", font=dict(color="#16a34a")),
            overlaying="y",
            side="right",
            range=[60, 105],
            showgrid=False
        )
    )
    return fig

def chart_credit_vs_debit(df: pd.DataFrame):
    """Credit (Green for Inflow/Success) vs Debit (Red for Outflow/Stop) Donut Chart."""
    if df.empty:
        return go.Figure()

    # Green for Credit/Inflow, Red for Debit/Outflow
    color_map = {
        "Credit (Inflow)": "#16a34a",
        "Debit (Outflow)": "#dc2626"
    }
    colors = [color_map.get(t, "#2563eb") for t in df["flow_type"]]

    fig = go.Figure(data=[go.Pie(
        labels=df["flow_type"],
        values=df["total_volume"],
        hole=0.62,
        marker=dict(colors=colors, line=dict(color="#ffffff", width=2.5)),
        textinfo="label+percent",
        textfont=dict(family=THEME_FONT, size=12, color="#ffffff"),
        hovertemplate="<b>%{label}</b><br>Volume: ₹%{value:,.2f}<br>Share: %{percent}<extra></extra>"
    )])
    return apply_fintech_theme(fig, title="Credit (Inflows - Green) vs Debit (Outflows - Red) Distribution")

def chart_balance_distribution(df: pd.DataFrame):
    """Account balance distribution histogram (Royal Blue)."""
    if df.empty or "account_balance" not in df.columns:
        return go.Figure()

    fig = px.histogram(
        df,
        x="account_balance",
        nbins=25,
        color_discrete_sequence=["#2563eb"],
        marginal="box"
    )
    fig.update_traces(
        marker=dict(line=dict(color="#1d4ed8", width=1)),
        hovertemplate="Balance Range: ₹%{x}<br>Count: %{y}<extra></extra>"
    )
    return apply_fintech_theme(fig, title="Customer Account Balance Distribution")

def chart_loan_status(df: pd.DataFrame):
    """Loan status distribution (Green for Active/Approved, Red for Defaulted)."""
    if df.empty:
        return go.Figure()

    status_colors = {
        "Active": "#16a34a",     # Green Success
        "Approved": "#2563eb",   # Royal Blue
        "Closed": "#64748b",     # Slate Neutral
        "Defaulted": "#dc2626"   # Red Stop/Alert
    }
    colors = [status_colors.get(s, "#0284c7") for s in df["Loan_Status"]]

    fig = go.Figure(data=[go.Bar(
        x=df["Loan_Status"],
        y=df["total_principal"],
        marker=dict(color=colors, line=dict(color="#ffffff", width=1.5)),
        text=[f"₹{v/10000000:.1f} Cr" for v in df["total_principal"]],
        textposition="outside",
        hovertemplate="<b>%{x}</b><br>Total Principal: ₹%{y:,.2f}<extra></extra>"
    )])
    return apply_fintech_theme(fig, title="Loan Portfolio Risk Profile (Green: Active | Red: Defaulted)")

def chart_branch_performance(df: pd.DataFrame):
    """Top branches by revenue and rating."""
    if df.empty:
        return go.Figure()

    df_top = df.head(8)
    fig = px.bar(
        df_top,
        x="branch_revenue",
        y="branch_name",
        orientation="h",
        color="performance_rating",
        color_continuous_scale="Blues",
        labels={"branch_revenue": "Revenue (₹)", "branch_name": "Branch", "performance_rating": "Rating (1-5)"}
    )
    fig.update_layout(yaxis=dict(autorange="reversed"))
    return apply_fintech_theme(fig, title="Top Branch Performance by Revenue & Rating")

def chart_customer_segmentation(df: pd.DataFrame):
    """Customer account type and demographics."""
    if df.empty:
        return go.Figure()

    fig = px.pie(
        df,
        names="account_type",
        hole=0.55,
        color_discrete_sequence=["#2563eb", "#0284c7"]
    )
    fig.update_traces(textinfo="label+percent")
    return apply_fintech_theme(fig, title="Customer Account Type Segmentation")

def chart_transaction_failures(df: pd.DataFrame):
    """Failed transactions by reason/type (Red for Stop / Failure Alert!)."""
    if df.empty:
        return go.Figure()

    fig = px.bar(
        df,
        x="txn_type",
        y="failed_count",
        color="failed_volume",
        color_continuous_scale="Reds",
        labels={"failed_count": "Failed Txn Count (Stop)", "txn_type": "Transaction Channel", "failed_volume": "Volume Aborted (₹)"}
    )
    return apply_fintech_theme(fig, title="⛔ Failed Transactions Breakdown by Channel (Red Alert)")

def render_dynamic_chart(df: pd.DataFrame, catalog_item: dict):
    """Renders the appropriate chart for any of the 15 analytical insights."""
    if df.empty:
        return None

    c_type = catalog_item.get("chart_type")
    title = catalog_item.get("title")

    if c_type == "bar":
        x = catalog_item.get("chart_x")
        y = catalog_item.get("chart_y")
        color_col = catalog_item.get("chart_color")
        if x in df.columns and y in df.columns:
            if color_col and color_col in df.columns:
                fig = px.bar(df, x=x, y=y, color=color_col, color_continuous_scale="Blues")
            else:
                fig = px.bar(df, x=x, y=y, color_discrete_sequence=["#2563eb"])
            return apply_fintech_theme(fig, title=title)
    elif c_type == "line":
        x = catalog_item.get("chart_x")
        y = catalog_item.get("chart_y")
        if x in df.columns and y in df.columns:
            fig = px.line(df, x=x, y=y, markers=True, color_discrete_sequence=["#2563eb"])
            return apply_fintech_theme(fig, title=title)
    elif c_type in ["pie", "donut"]:
        names = catalog_item.get("chart_names")
        values = catalog_item.get("chart_values")
        if names in df.columns and values in df.columns:
            hole = 0.55 if c_type == "donut" else 0.0
            fig = px.pie(df, names=names, values=values, hole=hole, color_discrete_sequence=COLOR_PALETTE)
            fig.update_traces(textinfo="label+percent")
            return apply_fintech_theme(fig, title=title)

    return None
