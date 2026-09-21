(() => {
  const searchInput = document.getElementById('name-search');
  const filterEls = [...document.querySelectorAll('.column-filter')];
  const body = document.getElementById('table-body');
  const visibleCount = document.getElementById('visible-count');
  const totalCount = document.getElementById('total-count');
  const rangeLabel = document.getElementById('range-label');
  const pageLabel = document.getElementById('page-label');
  const pageSizeEl = document.getElementById('page-size');
  const prevBtn = document.getElementById('prev-page');
  const nextBtn = document.getElementById('next-page');
  const clearDataBtn = document.getElementById('clear-data');
  let currentPage = 1;
  let pageSize = Number(pageSizeEl.value);

  const normalize = (value) => String(value ?? '').trim().toLowerCase();
  const nameColumnIndex = columns.findIndex(c => /ชื่อ|name|พนักงาน|employee/i.test(c));

  function rebuildFilterOptions() {
    filterEls.forEach((select, index) => {
      const previousValue = select.value;
      select.innerHTML = '<option value="">ทุกค่า</option>';
      const values = [...new Set(rows.map(row => row[columns[index]])
        .filter(v => String(v ?? '').trim() !== '').map(String))]
        .sort((a, b) => a.localeCompare(b, 'th'));
      values.forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
      });
      if (values.includes(previousValue)) select.value = previousValue;
    });
  }

  filterEls.forEach(select => select.addEventListener('change', () => { currentPage = 1; render(); }));

  function filteredRows() {
    const keyword = normalize(searchInput.value);
    return rows.filter(row => {
      const matchesName = !keyword || (nameColumnIndex >= 0
        ? normalize(row[columns[nameColumnIndex]]).includes(keyword)
        : columns.some(column => normalize(row[column]).includes(keyword)));
      const matchesFilters = filterEls.every(select => !select.value || String(row[columns[Number(select.dataset.column)]] ?? '') === select.value);
      return matchesName && matchesFilters;
    });
  }

  function render() {
    const filtered = filteredRows();
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    currentPage = Math.min(Math.max(currentPage, 1), totalPages);
    const start = (currentPage - 1) * pageSize;
    const pageRows = filtered.slice(start, start + pageSize);
    body.innerHTML = '';

    if (!pageRows.length) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = columns.length + 1;
      td.className = 'empty-cell';
      td.textContent = 'ไม่พบข้อมูลที่ตรงกับเงื่อนไข';
      tr.appendChild(td); body.appendChild(tr);
    } else {
      pageRows.forEach(row => {
        const tr = document.createElement('tr');
        columns.forEach(column => {
          const td = document.createElement('td');
          td.textContent = row[column] ?? '';
          tr.appendChild(td);
        });
        const actionTd = document.createElement('td');
        actionTd.className = 'action-cell';
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'row-delete-btn';
        deleteBtn.textContent = 'ลบ';
        deleteBtn.title = 'ลบรายการนี้';
        deleteBtn.addEventListener('click', () => {
          const targetIndex = rows.indexOf(row);
          if (targetIndex >= 0 && confirm('ต้องการลบข้อมูลพนักงานรายการนี้หรือไม่?')) {
            rows.splice(targetIndex, 1);
            totalCount.textContent = rows.length.toLocaleString('th-TH');
            currentPage = 1;
            rebuildFilterOptions();
            render();
          }
        });
        actionTd.appendChild(deleteBtn);
        tr.appendChild(actionTd);
        body.appendChild(tr);
      });
    }

    totalCount.textContent = rows.length.toLocaleString('th-TH');
    visibleCount.textContent = filtered.length.toLocaleString('th-TH');
    pageLabel.textContent = `${currentPage} / ${totalPages}`;
    rangeLabel.textContent = filtered.length ? `แสดง ${start + 1}-${Math.min(start + pageSize, filtered.length)} จาก ${filtered.length.toLocaleString('th-TH')} รายการ` : 'ไม่มีข้อมูล';
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;
  }

  searchInput.addEventListener('input', () => { currentPage = 1; render(); });
  pageSizeEl.addEventListener('change', () => { pageSize = Number(pageSizeEl.value); currentPage = 1; render(); });
  prevBtn.addEventListener('click', () => { currentPage--; render(); });
  nextBtn.addEventListener('click', () => { currentPage++; render(); });

  document.getElementById('reset-filters').addEventListener('click', () => {
    searchInput.value = '';
    filterEls.forEach(el => el.value = '');
    currentPage = 1;
    render();
  });

  clearDataBtn.addEventListener('click', () => {
    if (!rows.length) return;
    if (confirm('ต้องการล้างข้อมูลพนักงานทั้งหมดจากหน้าจอหรือไม่?')) {
      rows = [];
      searchInput.value = '';
      filterEls.forEach(el => el.value = '');
      currentPage = 1;
      rebuildFilterOptions();
      render();
    }
  });

  rebuildFilterOptions();
  render();
})();
