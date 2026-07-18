import React, { useState } from 'react';

const DataTable = ({ columns, data, onRowClick, emptyText = 'No data found' }) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = data.filter(row =>
    columns.some(col => {
      const val = col.key ? row[col.key] : '';
      return String(val || '').toLowerCase().includes(search.toLowerCase());
    })
  );

  const total = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      <div className="admin-toolbar">
        <div className="admin-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, color: 'var(--admin-text-muted)' }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            placeholder="Search..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <span style={{ fontSize: 13, color: 'var(--admin-text-muted)', marginLeft: 'auto' }}>
          {filtered.length} results
        </span>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key || col.label}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)' }}>
                  {emptyText}
                </td>
              </tr>
            ) : (
              paged.map((row, i) => (
                <tr key={row.id || i} onClick={() => onRowClick && onRowClick(row)}>
                  {columns.map(col => (
                    <td key={col.key || col.label} className={col.muted ? 'muted' : ''}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {total > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16 }}>
          <button
            className="admin-btn admin-btn-ghost admin-btn-sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >←</button>
          {Array.from({ length: total }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              className={`admin-btn admin-btn-sm ${page === p ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
              onClick={() => setPage(p)}
            >{p}</button>
          ))}
          <button
            className="admin-btn admin-btn-ghost admin-btn-sm"
            onClick={() => setPage(p => Math.min(total, p + 1))}
            disabled={page === total}
          >→</button>
        </div>
      )}
    </div>
  );
};

export default DataTable;
