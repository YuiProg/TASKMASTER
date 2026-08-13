import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PanelPage, PanelContainer } from '../../components/TRCOMPONENTS/TRPanelPage/TRPanelPage';
import { 
    ArrowLeft, Clock, Calendar, 
    User, CheckCircle2, AlertCircle, Trash2 
} from 'lucide-react';
import { useTodoStore } from '../../context/TodoStore.js';
import navigateTo from '../../lib/navigate';
import '../../styles/pages/Todos.scss';

const TodoDetail = () => {
    const { id } = useParams();
    const { 
        currentTodo, 
        isLoading, 
        error, 
        fetchTodoById, 
        toggleTodoStatus, 
        deleteTodo,
        clearCurrentTodo 
    } = useTodoStore();

    useEffect(() => {
        if (id) {
            fetchTodoById(id);
        }
        return () => clearCurrentTodo();
    }, [id, fetchTodoById, clearCurrentTodo]);

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp > 9999999999 ? timestamp : timestamp * 1000);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this todo?')) {
            await deleteTodo(currentTodo.id);
            navigateTo('/todos');
        }
    };

    const handleToggle = () => {
        if (currentTodo) {
            toggleTodoStatus(currentTodo.id, currentTodo.finished);
        }
    };

    const isCompleted = currentTodo?.finished === 1 || currentTodo?.finished === true;

    return (
        <PanelPage titlePage="Todo Details" subTitle="View task details and history">
            <Helmet>
                <title>{currentTodo ? `${currentTodo.todoName} | TaskMaster` : 'Todo Details'}</title>
            </Helmet>

            <PanelContainer>
                <div className="todo-page">
                    {/* Navigation Bar */}
                    <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button
                            type="button"
                            className="todo-filter-btn"
                            onClick={() => navigateTo('/todos')}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem' }}
                        >
                            <ArrowLeft size={16} /> Back to Todos
                        </button>

                        {currentTodo && (
                            <button
                                type="button"
                                className="todo-icon-btn"
                                onClick={handleDelete}
                                title="Delete Todo"
                                style={{ color: '#ef4444' }}
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>

                    {/* Details Container */}
                    {isLoading ? (
                        <div className="todo-empty">
                            <p>Loading todo details...</p>
                        </div>
                    ) : error ? (
                        <div className="todo-empty">
                            <AlertCircle size={32} color="#ef4444" />
                            <p style={{ color: '#ef4444' }}>{error}</p>
                        </div>
                    ) : currentTodo ? (
                        <div style={{
                            background: '#18181b',
                            border: '1px solid #27272a',
                            borderRadius: '12px',
                            padding: '2rem',
                            maxWidth: '700px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.5rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                <button
                                    type="button"
                                    className={`todo-item__checkbox ${isCompleted ? 'checked' : ''}`}
                                    onClick={handleToggle}
                                    style={{ marginTop: '0.2rem' }}
                                >
                                    {isCompleted && <CheckCircle2 size={16} />}
                                </button>
                                
                                <div style={{ flex: 1 }}>
                                    <h2 style={{ 
                                        margin: 0, 
                                        fontSize: '1.4rem', 
                                        fontWeight: 600, 
                                        color: '#f4f4f5',
                                        textDecoration: isCompleted ? 'line-through' : 'none',
                                        opacity: isCompleted ? 0.7 : 1
                                    }}>
                                        {currentTodo.todoName}
                                    </h2>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                        <span className={`todo-badge ${isCompleted ? 'todo-badge--completed' : ''}`}>
                                            {isCompleted ? 'Completed' : 'Pending'}
                                        </span>
                                        {currentTodo.createdBy?.role && (
                                            <span className="todo-badge todo-badge--category">
                                                {currentTodo.createdBy.role}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div style={{ 
                                background: '#09090b', 
                                border: '1px solid #27272a', 
                                borderRadius: '8px', 
                                padding: '1rem 1.25rem' 
                            }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>
                                    Description
                                </label>
                                <p style={{ margin: 0, color: currentTodo.description ? '#d4d4d8' : '#71717a', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                    {currentTodo.description || 'No description provided.'}
                                </p>
                            </div>

                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                                gap: '1rem',
                                borderTop: '1px solid #27272a',
                                paddingTop: '1.25rem'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#a1a1aa', fontSize: '0.875rem' }}>
                                    <Clock size={16} color="#a1a1aa" />
                                    <div>
                                        <span style={{ display: 'block', fontSize: '0.75rem', color: '#71717a' }}>Deadline</span>
                                        <strong>{formatDate(currentTodo.deadline)}</strong>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#a1a1aa', fontSize: '0.875rem' }}>
                                    <Calendar size={16} color="#a1a1aa" />
                                    <div>
                                        <span style={{ display: 'block', fontSize: '0.75rem', color: '#71717a' }}>Created At</span>
                                        <strong>{formatDate(currentTodo.createdAt)}</strong>
                                    </div>
                                </div>

                                {currentTodo.createdBy?.username && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#a1a1aa', fontSize: '0.875rem' }}>
                                        <User size={16} color="#a1a1aa" />
                                        <div>
                                            <span style={{ display: 'block', fontSize: '0.75rem', color: '#71717a' }}>Created By</span>
                                            <strong>{currentTodo.createdBy.username} ({currentTodo.createdBy.email})</strong>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : null}
                </div>
            </PanelContainer>
        </PanelPage>
    );
};

export default TodoDetail;