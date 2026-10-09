import type { Filter } from '../types';

const FILTERS: [Filter, string][] = [['all', 'Todas'], ['todo', 'Pendentes'], ['done', 'Feitas']];

type Props = {
    filter: Filter;
    onFilter: (filter: Filter) => void;
    query: string;
    onQuery: (query: string) => void;
};

export function Toolbar({ filter, onFilter, query, onQuery }: Props) {
    return (
        <div className="toolbar" data-intro>
            <div className="tabs" role="group" aria-label="Filtrar tarefas">
                {FILTERS.map(([value, label]) => (
                    <button key={value} type="button" aria-pressed={filter === value} onClick={() => onFilter(value)}>{label}</button>
                ))}
            </div>
            <label className="search">
                <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
                <input type="search" value={query} onChange={e => onQuery(e.target.value)} placeholder="Procurar" aria-label="Buscar tarefas" />
            </label>
        </div>
    );
}
