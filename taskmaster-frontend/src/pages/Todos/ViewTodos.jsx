import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { PanelPage, PanelContainer } from '../../components/TRCOMPONENTS/TRPanelPage/TRPanelPage';
import Button from '../../components/TRCOMPONENTS/TRButton/Button';
import { InputField } from '../../components/TRCOMPONENTS/TRInputField/InputFIeld';
import { 
    Plus, Filter, CheckCircle2, 
    Clock, Trash2, AlertCircle, User,
    ChevronLeft, ChevronRight 
} from 'lucide-react';
import navigateTo from '../../lib/navigate';
import { useTodoStore } from '../../context/TodoStore.js';
import '../../styles/pages/Todos.scss';

const ITEMS_PER_PAGE = 5;

const ViewTodos = () => {
    const { 
        todos, 
        isLoading, 
        fetchTodos, 
        toggleTodoStatus, 
        deleteTodo 
    } = useTodoStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'pending' | 'completed'
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    // Handlers that reset pagination directly to prevent linter cascading-render warnings
    const handleSearchChange = (e) => {
        const val = e?.target ? e.target.value : e;
        setSearchQuery(val || '');
        setCurrentPage(1);
    };

    const handleFilterChange = (status) => {
        setFilterStatus(status);
        setCurrentPage(1);
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return null;
        const date = new Date(timestamp > 9999999999 ? timestamp : timestamp * 1000);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Filter Logic
    const filteredTodos = todos.filter(todo => {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
            (todo.todoName && todo.todoName.toLowerCase().includes(query)) ||
            (todo.description && todo.description.toLowerCase().includes(query));

        const isCompleted = todo.finished === 1 || todo.finished === true;

        if (filterStatus === 'pending') return matchesSearch && !isCompleted;
        if (filterStatus === 'completed') return matchesSearch && isCompleted;
        return matchesSearch;
    });

    // Pagination Calculations
    const totalPages = Math.ceil(filteredTodos.length / ITEMS_PER_PAGE) || 1;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedTodos = filteredTodos.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    return (
        <PanelPage titlePage="Todos" subTitle="Manage your personal tasks and checklists">
            <Helmet>
                <title>Todos | TaskMaster</title>
            </Helmet>

            <PanelContainer>
                <div className="todo-page">
                    {/* Toolbar */}
                    <div className="todo-toolbar">
                        <div className="todo-toolbar__left">
                            <div className="todo-toolbar__search">
                                <InputField
                                    placeholder="Search todos..."
                                    isSearch
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </div>

                            <div className="todo-filter-group">
                                <Filter size={15} />
                                <button
                                    type="button"
                                    className={`todo-filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                                    onClick={() => handleFilterChange('all')}
                                >
                                    All
                                </button>
                                <button
                                    type="button"
                                    className={`todo-filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
                                    onClick={() => handleFilterChange('pending')}
                                >
                                    Pending
                                </button>
                                <button
                                    type="button"
                                    className={`todo-filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
                                    onClick={() => handleFilterChange('completed')}
                                >
                                    Completed
                                </button>
                            </div>
                        </div>

                        <Button
                            text={
                                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <Plus size={16} /> New Todo
                                </span>
                            }
                            onClick={() => navigateTo('/todos/create')}
                        />
                    </div>

                    {/* Todo List */}
                    <div className="todo-list">
                        {isLoading ? (
                            <div className="todo-empty">
                                <p>Loading todos...</p>
                            </div>
                        ) : paginatedTodos.length === 0 ? (
                            <div className="todo-empty">
                                <AlertCircle size={32} />
                                <p>No todos found</p>
                            </div>
                        ) : (
                            paginatedTodos.map((todo) => {
                                const isCompleted = todo.finished === 1 || todo.finished === true;

                                return (
                                    <div
                                        key={todo.id}
                                        className={`todo-item ${isCompleted ? 'todo-item--completed' : ''}`}
                                    >
                                        {/* Toggle Checkbox Button */}
                                        <button
                                            type="button"
                                            className={`todo-item__checkbox ${isCompleted ? 'checked' : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleTodoStatus(todo.id, todo.finished);
                                            }}
                                            aria-label="Toggle todo status"
                                        >
                                            {isCompleted && <CheckCircle2 size={16} />}
                                        </button>

                                        {/* Content area navigating to view details */}
                                        <div 
                                            className="todo-item__content"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => navigateTo(`/todos/view/${todo.id}`)}
                                        >
                                            <div className="todo-item__top">
                                                <h3 className="todo-item__title">{todo.todoName}</h3>
                                                {todo.createdBy?.role && (
                                                    <span className="todo-badge todo-badge--category">
                                                        {todo.createdBy.role}
                                                    </span>
                                                )}
                                            </div>

                                            {todo.description && (
                                                <p className="todo-item__description">{todo.description}</p>
                                            )}

                                            <div className="todo-item__meta">
                                                {todo.deadline && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                        <Clock size={13} />
                                                        <span>Due {formatDate(todo.deadline)}</span>
                                                    </div>
                                                )}

                                                {todo.createdBy?.username && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                        <User size={13} />
                                                        <span>{todo.createdBy.username}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="todo-item__actions">
                                            <button
                                                type="button"
                                                className="todo-icon-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteTodo(todo.id);
                                                }}
                                                title="Delete Todo"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {!isLoading && filteredTodos.length > 0 && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: '1.5rem',
                            paddingTop: '1rem',
                            borderTop: '1px solid #27272a',
                            color: '#a1a1aa',
                            fontSize: '0.875rem'
                        }}>
                            <div>
                                Showing <strong>{startIndex + 1}</strong> to <strong>{Math.min(startIndex + ITEMS_PER_PAGE, filteredTodos.length)}</strong> of <strong>{filteredTodos.length}</strong> todos
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <button
                                    type="button"
                                    className="todo-filter-btn"
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        opacity: currentPage === 1 ? 0.4 : 1,
                                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    <ChevronLeft size={16} /> Previous
                                </button>

                                <span style={{ padding: '0 0.5rem', fontWeight: 500 }}>
                                    Page {currentPage} of {totalPages}
                                </span>

                                <button
                                    type="button"
                                    className="todo-filter-btn"
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        opacity: currentPage === totalPages ? 0.4 : 1,
                                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    Next <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </PanelContainer>
        </PanelPage>
    );
};

export default ViewTodos;