import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { PanelPage, PanelContainer } from '../../components/TRCOMPONENTS/TRPanelPage/TRPanelPage';
import { InputField } from '../../components/TRCOMPONENTS/TRInputField/InputFIeld';
import { ArrowLeft, PlusCircle, AlertCircle } from 'lucide-react';
import { useTodoStore } from '../../context/TodoStore.js';
import navigateTo from '../../lib/navigate';
import '../../styles/pages/Todos.scss';

const CreateTodo = () => {
    const { addTodo, isLoading, error, clearError } = useTodoStore();

    const [todoName, setTodoName] = useState('');
    const [description, setDescription] = useState('');
    const [deadlineDate, setDeadlineDate] = useState('');
    const [formError, setFormError] = useState('');

    const handleNameChange = (val) => {
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

        let deadlineTimestamp = null;
        if (deadlineDate) {
            deadlineTimestamp = Math.floor(new Date(deadlineDate).getTime() / 1000);
        }

        const success = await addTodo({
            todoName: todoName.trim(),
            description: description.trim(),
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
                <div className="todo-page todo-page--full">
                    {/* Top Action Header */}
                    <div className="todo-form-header">
                        <button
                            type="button"
                            className="todo-back-btn"
                            onClick={() => navigateTo('/todos')}
                        >
                            <ArrowLeft size={16} />
                            <span>Back to Todos</span>
                        </button>
                    </div>

                    {/* Error Notification Banner */}
                    {(formError || error) && (
                        <div className="todo-error-banner">
                            <AlertCircle size={16} />
                            <span>{formError || error}</span>
                        </div>
                    )}

                    {/* Form Layout */}
                    <form onSubmit={handleSubmit} className="todo-form">
                        <div className="todo-form-group">
                            <label className="todo-label">
                                Todo Name <span className="required-star">*</span>
                            </label>
                            <InputField
                                placeholder="e.g. Update user permissions flow"
                                value={todoName}
                                onChange={handleNameChange}
                            />
                        </div>

                        <div className="todo-form-group">
                            <label className="todo-label">Description</label>
                            <textarea
                                className="todo-textarea"
                                rows={6}
                                placeholder="Add context, details, or steps for this task..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="todo-form-group">
                            <label className="todo-label">Deadline</label>
                            <input
                                type="date"
                                className="todo-date-input"
                                value={deadlineDate}
                                onChange={(e) => setDeadlineDate(e.target.value)}
                            />
                        </div>

                        <div className="todo-form-actions">
                            <button
                                type="button"
                                className="todo-btn-secondary"
                                onClick={() => navigateTo('/todos')}
                            >
                                Cancel
                            </button>
                            
                            <button
                                type="submit"
                                className="todo-btn-primary"
                                disabled={isLoading}
                            >
                                <PlusCircle size={16} />
                                <span>{isLoading ? 'Creating...' : 'Create Todo'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </PanelContainer>
        </PanelPage>
    );
};

export default CreateTodo;