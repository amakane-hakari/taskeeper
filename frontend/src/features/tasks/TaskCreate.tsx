import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { createTask } from "./tasksSlice";
import * as styles from "./TaskCreate.css";

interface FormErrors {
  title?: string;
  description?: string;
  dueDate?: string;
}

export const TaskCreate = () => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.tasks.status);
  const error = useSelector((state: RootState) => state.tasks.error);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "タイトルは必須です";
    }

    if (formData.dueDate && new Date(formData.dueDate) < new Date()) {
      newErrors.dueDate = "期限は現在以降の日付を指定してください";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(createTask(formData)).unwrap();
      setFormData({
        title: "",
        description: "",
        dueDate: "",
      });
    } catch (error) {
      console.error("タスクの作成に失敗しました:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.label}>タイトル</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="タスクのタイトルを入力"
          className={styles.input}
        />
        {errors.title && <span className={styles.errorText}>{errors.title}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.label}>説明</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="タスクの説明を入力"
          className={styles.textArea}
        />
        {errors.description && <span className={styles.errorText}>{errors.description}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="dueDate" className={styles.label}>期限</label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className={styles.input}
        />
        {errors.dueDate && <span className={styles.errorText}>{errors.dueDate}</span>}
      </div>

      {error && <span className={styles.errorText}>{error}</span>}

      <button type="submit" disabled={status === "loading"} className={styles.submitButton}>
        {status === "loading" ? "作成中..." : "作成"}
      </button>
    </form>
  );
};
