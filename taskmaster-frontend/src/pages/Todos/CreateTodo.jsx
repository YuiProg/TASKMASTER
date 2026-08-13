import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { PanelPage, PanelContainer } from '../../components/TRCOMPONENTS/TRPanelPage/TRPanelPage';
import Button from '../../components/TRCOMPONENTS/TRButton/Button';
import { InputField } from '../../components/TRCOMPONENTS/TRInputField/InputFIeld';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { useTodoStore } from '../../context/TodoStore.js';
import navigateTo from '../../lib/navigate';
import '../../styles/pages/Todos.scss';

const CreateTodo = () => {
    // 1. Destructure addTodo directly from the store
    const { addTodo, isLoading, error, clearError } = useTodoStore();

    const [todoName, setTodoName] = useState('');
    const [deadlineDate, setDeadlineDate] = useState('');
    const [formError, setFormError] = useState('');

    const handleNameChange = (val) => {
        // Handles both custom input value and standard synthetic event
        const textValue = val?.target ? val.target.value : val;
        setTodoName(textValue || '');
        if (formError) setFormError('');
        if (error) clearError();
    };

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }

        if (!todoName.trim()) {
            setFormError('Todo name is required.');
            return;
        }

        // Format deadline to Unix epoch seconds
        let deadlineTimestamp = null;
        if (deadlineDate) {
            deadlineTimestamp = Math.floor(new Date(deadlineDate).getTime() / 1000);
        }

        // 2. Trigger the Zustand action
        const success = await addTodo({
            todoName: todoName.trim(),
            deadline: deadlineTimestamp,
        });

        if (success) {
            navigateTo('/todos');
        }
    };

    return (
        <PanelPage titlePage="Create Todo" subTitle="Add a new task to your list">
            <Helmet>
                <title>Create Todo | TaskMaster</title>
            </Helmet>

            <PanelContainer>
                <div className="todo-page">
                    <div style={{ marginBottom: '1.5rem' }}>
                        <button
                            type="button"
                            className="todo-filter-btn"
                            onClick={() => navigateTo('/todos')}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem' }}
                        >
                            <ArrowLeft size={16} /> Back to Todos
                        </button>
                    </div>

                    <div style={{
                        background: '#18181b',
                        border: '1px solid #27272a',
                        borderRadius: '12px',
                        padding: '1.75rem',
                        maxWidth: '550px',
                    }}>
                        {(formError || error) && (
                            <div style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                color: '#f87171',
                                padding: '0.75rem 1rem',
                                borderRadius: '8px',
                                marginBottom: '1.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.875rem',
                            }}>
                                <AlertCircle size={16} />
                                <span>{formError || error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: '#a1a1aa', fontWeight: 500 }}>
                                    Todo Name <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <InputField
                                    placeholder="e.g. test todo 23"
                                    value={todoName}
                                    onChange={handleNameChange}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: '#a1a1aa', fontWeight: 500 }}>
                                    Deadline
                                </label>
                                <input
                                    type="date"
                                    value={deadlineDate}
                                    onChange={(e) => setDeadlineDate(e.target.value)}
                                    style={{
                                        width: '100%',
                                        background: '#09090b',
                                        border: '1px solid #27272a',
                                        borderRadius: '8px',
                                        padding: '0.65rem 1rem',
                                        color: '#f4f4f5',
                                        fontSize: '0.9rem',
                                        outline: 'none',
                                        colorScheme: 'dark',
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                                <button
                                    type="button"
                                    className="todo-filter-btn"
                                    onClick={() => navigateTo('/todos')}
                                >
                                    Cancel
                                </button>
                                {/* Added explicit onClick here alongside form submission to guarantee execution */}
                                <Button
                                    text={
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Save size={16} /> {isLoading ? 'Creating...' : 'Create Todo'}
                                        </span>
                                    }
                                    type="submit"
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </PanelContainer>
        </PanelPage>
    );
};

export default CreateTodo;