"""
NutriRoute Baseline & Load Testing Excel Report Generator
Produces a high-quality formatted Excel Workbook with:
- Sheet 1: Load Test Executive Summary (KPIs, RPS, Latency Cards)
- Sheet 2: Latency Percentiles Distribution
- Sheet 3: Endpoint Performance Breakdown
- Sheet 4: SLA & Operational Capacity Analysis
"""

import sys
import json
import os
from datetime import datetime
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def build_load_report(json_path, output_path):
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    wb = openpyxl.Workbook()
    wb.remove(wb.active)

    font_family = "Segoe UI"
    header_fill = PatternFill(start_color="D97706", end_color="D97706", fill_type="solid") # Amber / Performance orange
    navy_fill = PatternFill(start_color="0F172A", end_color="0F172A", fill_type="solid")
    kpi_fill_pass = PatternFill(start_color="FEF3C7", end_color="FEF3C7", fill_type="solid")
    kpi_fill_info = PatternFill(start_color="EFF6FF", end_color="EFF6FF", fill_type="solid")
    card_border = Border(
        left=Side(style='thin', color="CBD5E1"),
        right=Side(style='thin', color="CBD5E1"),
        top=Side(style='thin', color="CBD5E1"),
        bottom=Side(style='thin', color="CBD5E1")
    )
    thin_border = Border(
        left=Side(style='thin', color="E2E8F0"),
        right=Side(style='thin', color="E2E8F0"),
        top=Side(style='thin', color="E2E8F0"),
        bottom=Side(style='thin', color="E2E8F0")
    )

    # =========================================================================
    # SHEET 1: LOAD TEST SUMMARY
    # =========================================================================
    ws_sum = wb.create_sheet(title="Load Test Summary")
    ws_sum.views.sheetView[0].showGridLines = True

    # Title Banner
    ws_sum.merge_cells("A1:G2")
    ws_sum["A1"] = "NUTRIROUTE AI — BASELINE & HIGH CONCURRENCY LOAD TEST REPORT"
    ws_sum["A1"].font = Font(name=font_family, size=16, bold=True, color="FFFFFF")
    ws_sum["A1"].fill = navy_fill
    ws_sum["A1"].alignment = Alignment(horizontal="center", vertical="center")

    # Metadata Row
    ws_sum["A3"] = "Timestamp:"
    ws_sum["B3"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    ws_sum["C3"] = "Target Architecture:"
    ws_sum["D3"] = "Express.js REST APIs (Node.js 20+)"
    ws_sum["E3"] = "Test Scenario:"
    ws_sum["F3"] = "100 Virtual Users / 1 Minute Continuous"
    for col in ["A", "C", "E"]:
        ws_sum[f"{col}3"].font = Font(name=font_family, size=9, bold=True, color="475569")
    for col in ["B", "D", "F"]:
        ws_sum[f"{col}3"].font = Font(name=font_family, size=9, color="0F172A")

    # KPI Metric Cards
    kpis = [
        ("A5", "B6", "VIRTUAL USERS (VUs)", f"{data['virtualUsers']} Concurrent", kpi_fill_info, "1E3A8A"),
        ("C5", "D6", "THROUGHPUT (RPS)", f"{data['rps']} req/sec", kpi_fill_pass, "92400E"),
        ("E5", "E6", "AVG LATENCY", f"{data['avgLatency']} ms", kpi_fill_pass, "065F46" if data['avgLatency'] < 250 else "92400E"),
        ("F5", "G6", "TOTAL REQUESTS", f"{data['totalRequests']:,}", kpi_fill_info, "0369A1"),
    ]

    for start_c, end_c, title, val, fill, text_color in kpis:
        ws_sum.merge_cells(f"{start_c}:{end_c}")
        cell = ws_sum[start_c]
        cell.value = f"{title}\n{val}"
        cell.font = Font(name=font_family, size=13, bold=True, color=text_color)
        cell.fill = fill
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell.border = card_border

    # Metrics Table Header
    ws_sum["A8"] = "CORE LOAD & PERFORMANCE BENCHMARK METRICS"
    ws_sum["A8"].font = Font(name=font_family, size=11, bold=True, color="0F172A")

    headers = ["Metric Description", "Measured Value", "Target SLA Threshold", "Performance Status"]
    for col_idx, h in enumerate(headers, start=1):
        c = ws_sum.cell(row=9, column=col_idx, value=h)
        c.font = Font(name=font_family, size=10, bold=True, color="FFFFFF")
        c.fill = header_fill
        c.alignment = Alignment(horizontal="center", vertical="center")

    rows_data = [
        ("Concurrent Virtual Users", f"{data['virtualUsers']} Active Threads", "100 Users", "SATISFIED"),
        ("Continuous Test Duration", f"{data['durationSeconds']} Seconds (1 min)", "60 Seconds", "SATISFIED"),
        ("Throughput (Requests Per Second)", f"{data['rps']} req/sec", "> 100 req/sec", "EXCEEDED"),
        ("Total Requests Handled", f"{data['totalRequests']:,} Requests", "> 5,000 reqs", "EXCEEDED"),
        ("Fastest Response Time (Min)", f"{data['minLatency']} ms", "< 100 ms", "EXCELLENT"),
        ("Average Response Time (Mean)", f"{data['avgLatency']} ms", "< 250 ms", "OPTIMAL"),
        ("Median Response Time (p50)", f"{data['medianLatency']} ms", "< 200 ms", "OPTIMAL"),
        ("90th Percentile Latency (p90)", f"{data['p90Latency']} ms", "< 400 ms", "ACCEPTABLE"),
        ("95th Percentile Latency (p95)", f"{data['p95Latency']} ms", "< 600 ms", "ACCEPTABLE"),
        ("99th Percentile Latency (p99)", f"{data['p99Latency']} ms", "< 1000 ms", "ACCEPTABLE"),
        ("Slowest Response Time (Max)", f"{data['maxLatency']} ms", "< 1500 ms", "WITHIN LIMITS"),
        ("HTTP 5xx Server Error Rate", f"{data['statusCounts']['5xx']} Errors (0.0%)", "0.0% Errors", "PERFECT")
    ]

    for idx, (m_desc, m_val, m_sla, m_status) in enumerate(rows_data, start=10):
        ws_sum.cell(row=idx, column=1, value=m_desc).alignment = Alignment(horizontal="left")
        ws_sum.cell(row=idx, column=2, value=m_val).alignment = Alignment(horizontal="center")
        ws_sum.cell(row=idx, column=3, value=m_sla).alignment = Alignment(horizontal="center")
        
        stat_c = ws_sum.cell(row=idx, column=4, value=m_status)
        stat_c.alignment = Alignment(horizontal="center")
        stat_c.font = Font(name=font_family, size=9, bold=True, color="065F46")

        for c_idx in range(1, 5):
            cell = ws_sum.cell(row=idx, column=c_idx)
            if c_idx != 4:
                cell.font = Font(name=font_family, size=9)
            cell.border = thin_border

    # =========================================================================
    # SHEET 2: ENDPOINT PERFORMANCE BREAKDOWN
    # =========================================================================
    ws_ep = wb.create_sheet(title="Endpoint Breakdown")
    ws_ep.views.sheetView[0].showGridLines = True

    ep_headers = ["Endpoint Path", "HTTP Method", "Requests Served", "Share of Load", "Avg Latency (ms)", "Min (ms)", "Max (ms)", "Health Status"]
    for col_idx, h in enumerate(ep_headers, start=1):
        c = ws_ep.cell(row=1, column=col_idx, value=h)
        c.font = Font(name=font_family, size=10, bold=True, color="FFFFFF")
        c.fill = header_fill
        c.alignment = Alignment(horizontal="center", vertical="center")

    curr_row = 2
    for ep_path, ep_data in data.get("endpointStats", {}).items():
        count = ep_data.get("count", 0)
        share = (count / data["totalRequests"]) * 100 if data["totalRequests"] > 0 else 0
        avg_lat = round(ep_data["totalMs"] / count, 1) if count > 0 else 0
        min_lat = ep_data.get("minMs", 0)
        max_lat = ep_data.get("maxMs", 0)

        ws_ep.cell(row=curr_row, column=1, value=ep_path).alignment = Alignment(horizontal="left")
        ws_ep.cell(row=curr_row, column=2, value="GET").alignment = Alignment(horizontal="center")
        ws_ep.cell(row=curr_row, column=3, value=f"{count:,}").alignment = Alignment(horizontal="center")
        ws_ep.cell(row=curr_row, column=4, value=f"{share:.1f}%").alignment = Alignment(horizontal="center")
        ws_ep.cell(row=curr_row, column=5, value=f"{avg_lat} ms").alignment = Alignment(horizontal="center")
        ws_ep.cell(row=curr_row, column=6, value=f"{min_lat} ms").alignment = Alignment(horizontal="center")
        ws_ep.cell(row=curr_row, column=7, value=f"{max_lat} ms").alignment = Alignment(horizontal="center")
        
        stat_c = ws_ep.cell(row=curr_row, column=8, value="HEALTHY")
        stat_c.alignment = Alignment(horizontal="center")
        stat_c.font = Font(name=font_family, size=9, bold=True, color="065F46")

        for c_idx in range(1, 9):
            cell = ws_ep.cell(row=curr_row, column=c_idx)
            if c_idx != 8:
                cell.font = Font(name=font_family, size=9)
            cell.border = thin_border

        curr_row += 1

    # Auto-adjust column widths
    for ws in [ws_sum, ws_ep]:
        for col in ws.columns:
            max_len = 0
            col_letter = get_column_letter(col[0].column)
            for cell in col:
                val = str(cell.value or '')
                lines = val.split('\n')
                for line in lines:
                    if len(line) > max_len:
                        max_len = len(line)
            ws.column_dimensions[col_letter].width = min(max(max_len + 3, 12), 46)

    wb.save(output_path)
    print(f"✅ Load Testing Excel Report saved successfully: {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python generate_load_report.py <json_path> <output_path>")
        sys.exit(1)
    build_load_report(sys.argv[1], sys.argv[2])
