import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { PanelPage, PanelContainer } from '../../components/TRCOMPONENTS/TRPanelPage/TRPanelPage';

import { InputField } from '../../components/TRCOMPONENTS/TRInputField/InputFIeld';
import { 
    Plus, Filter, CheckCircle2, Circle,
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

    const handleSearchChange = useCallback((e) => {
        const val = e?.target ? e.target.value : e;
        setSearchQuery(val || '');
        setCurrentPage(1);
    }, []);

    const handleFilterChange = useCallback((status) => {
        setFilterStatus(status);
        setCurrentPage(1);
    }, []);

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
    const totalPages = Math.max(1, Math.ceil(filteredTodos.length / ITEMS_PER_PAGE));
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedTodos = filteredTodos.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

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

                            <div className="todo-filter-group" role="group" aria-label="Filter Todos">
                                <Filter size={14} className="todo-filter-icon" />
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

                        {/* Fixed Button rendering without broken text prop */}
                        <div className="todo-toolbar__action">
                            <button 
                                type="button" 
                                className="todo-create-btn"
                                onClick={() => navigateTo('/todos/create')}
                            >
                                <Plus size={16} />
                                <span>New Todo</span>
                            </button>
                        </div>
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
                                        {/* Checkbox Icon Button */}
                                        <button
                                            type="button"
                                            className={`todo-item__checkbox ${isCompleted ? 'checked' : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleTodoStatus(todo.id, todo.finished);
                                            }}
                                            aria-label={`Mark "${todo.todoName}" as ${isCompleted ? 'incomplete' : 'complete'}`}
                                        >
                                            {isCompleted ? (
                                                <CheckCircle2 size={20} className="icon-check" />
                                            ) : (
                                                <Circle size={20} className="icon-uncheck" />
                                            )}
                                        </button>

                                        {/* Card Main Body */}
                                        <div 
                                            className="todo-item__content"
                                            onClick={() => navigateTo(`/todos/view/${todo.id}`)}
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    navigateTo(`/todos/view/${todo.id}`);
                                                }
                                            }}
                                        >
                                            <div className="todo-item__header">
                                                <h3 className="todo-item__title">{todo.todoName}</h3>
                                                {todo.createdBy?.role && (
                                                    <span className="todo-badge">
                                                        {todo.createdBy.role}
                                                    </span>
                                                )}
                                            </div>

                                            {todo.description && (
                                                <p className="todo-item__description">{todo.description}</p>
                                            )}

                                            <div className="todo-item__meta">
                                                {todo.deadline && (
                                                    <div className="todo-item__meta-tag">
                                                        <Clock size={13} />
                                                        <span>Due {formatDate(todo.deadline)}</span>
                                                    </div>
                                                )}

                                                {todo.createdBy?.username && (
                                                    <div className="todo-item__meta-tag">
                                                        <User size={13} />
                                                        <span>{todo.createdBy.username}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Trash Button */}
                                        <div className="todo-item__actions">
                                            <button
                                                type="button"
                                                className="todo-delete-btn"
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
                        <div className="todo-pagination">
                            <div className="todo-pagination__info">
                                Showing <strong>{startIndex + 1}</strong> to <strong>{Math.min(startIndex + ITEMS_PER_PAGE, filteredTodos.length)}</strong> of <strong>{filteredTodos.length}</strong> todos
                            </div>

                            <div className="todo-pagination__controls">
                                <button
                                    type="button"
                                    className="todo-page-btn"
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft size={16} /> Previous
                                </button>

                                <span className="todo-page-status">
                                    Page {currentPage} of {totalPages}
                                </span>

                                <button
                                    type="button"
                                    className="todo-page-btn"
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
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