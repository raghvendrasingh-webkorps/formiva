import { useState, useEffect, useRef } from "react";
import { formiva, FormivaConfig, FormivaState } from "../core/formiva";

export function useFormiva<T extends Record<string, unknown>>(
  config: FormivaConfig<T>
) {
  const formRef = useRef<ReturnType<typeof formiva<T>> | null>(null);

  if (formRef.current === null) {
    formRef.current = formiva(config);
  }

  const form = formRef.current;

  const [state, setState] = useState<FormivaState<T>>(
    form.getValues()
  );

  useEffect(() => {
    const unsubscribe = form.subscribe(setState);
    return unsubscribe;
  }, [form]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = e.target;
    form.setValue(name as keyof T, value as T[keyof T]);
  }

  function handleBlur(
    e: React.FocusEvent<HTMLInputElement>
  ) {
    const { name } = e.target;
    form.setTouched(name as keyof T);
  }

  function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();      
    form.handleSubmit();     
  }

  return {
    ...state,
    handleSubmit,   
    handleChange,
    handleBlur,
    setValue: form.setValue,
    setTouched: form.setTouched,
  };
}

