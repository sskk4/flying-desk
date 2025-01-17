const Table = ({ data, columns }) => {
    return (
        <table className="data-table">
            <thead>
                <tr>
                    {columns.map((col) => (
                        <th key={col.key}>{col.label}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row) => (
                    <tr key={row.id}>
                        {columns.map((col) => (
                            <td key={col.key}>{col.render ? col.render(row[col.key]) : row[col.key]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
export default Table;
