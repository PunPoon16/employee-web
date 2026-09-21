from flask import Flask, render_template, request, redirect, url_for, flash
import pandas as pd
import io
import json
import math

app = Flask(__name__)
app.secret_key = 'change-this-secret-key'

ALLOWED_EXTENSIONS = {'.csv', '.xlsx', '.xls'}
MAX_ROWS = 5000


def clean_value(value):
    if pd.isna(value):
        return ''
    if hasattr(value, 'isoformat'):
        return value.isoformat()
    if isinstance(value, float) and math.isnan(value):
        return ''
    return str(value)


def read_employee_file(file_storage):
    filename = (file_storage.filename or '').lower()
    if filename.endswith('.csv'):
        raw = file_storage.read()
        try:
            df = pd.read_csv(io.BytesIO(raw), encoding='utf-8-sig')
        except UnicodeDecodeError:
            df = pd.read_csv(io.BytesIO(raw), encoding='cp874')
    elif filename.endswith(('.xlsx', '.xls')):
        df = pd.read_excel(file_storage)
    else:
        raise ValueError('รองรับเฉพาะไฟล์ CSV, XLSX และ XLS')

    if df.empty:
        raise ValueError('ไฟล์ไม่มีข้อมูล')
    if len(df) > MAX_ROWS:
        raise ValueError(f'ไฟล์มีข้อมูลเกิน {MAX_ROWS:,} แถว')

    # Normalize column names and remove completely empty columns.
    df.columns = [str(col).strip() or f'คอลัมน์ {i + 1}' for i, col in enumerate(df.columns)]
    df = df.dropna(axis=1, how='all')
    columns = list(df.columns)
    rows = [{column: clean_value(row[column]) for column in columns} for _, row in df.iterrows()]
    return columns, rows


@app.route('/', methods=['GET', 'POST'])
def index():
    columns, rows, filename = [], [], ''
    if request.method == 'POST':
        upload = request.files.get('employee_file')
        if not upload or not upload.filename:
            flash('กรุณาเลือกไฟล์ข้อมูลพนักงานก่อนอัปโหลด', 'error')
        else:
            try:
                columns, rows = read_employee_file(upload)
                filename = upload.filename
                flash(f'อัปโหลดสำเร็จ {len(rows):,} รายการ', 'success')
            except Exception as exc:
                flash(str(exc), 'error')
    return render_template('index.html', columns=columns, rows=rows, filename=filename)


if __name__ == '__main__':
    app.run(debug=True)
