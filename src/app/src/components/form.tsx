import { useFormik } from 'formik';
import type { FormikValues } from 'formik';
import React from 'react';

export type FormItemProps = {
    name: string;
    required?: boolean;
    className: string;
    onChange: {
        (e: React.ChangeEvent<any>): void;
        <F = string | React.ChangeEvent<any>>(
            field: F,
        ): F extends React.ChangeEvent<any> ? void : (e: string | React.ChangeEvent<any>) => void;
    };
    value: any;
};

export type FormItem = {
    label: string | JSX.Element;
    required?: boolean;
    input: (props: FormItemProps) => JSX.Element;
};

type FormikArgs<V extends FormikValues> = Parameters<typeof useFormik<V>>[0];
type FormikResult<V extends FormikValues> = ReturnType<typeof useFormik<V>>;

type FormikArgsWithOnSubmit<V extends FormikValues> = Omit<FormikArgs<V>, 'onSubmit'> & {
    onSubmit: (values: V, setError: React.Dispatch<React.SetStateAction<string | null>>) => Promise<void>;
};

type FormDefinition<V extends FormikValues> = {
    error: string | null;
    form: FormikResult<V>;
};

export function useForm<V extends FormikValues>(args: FormikArgsWithOnSubmit<V>): FormDefinition<V> {
    const [error, setError] = React.useState<string | null>(null);
    const form = useFormik<V>({
        ...args,
        onSubmit: async values => {
            setError(null);
            await args.onSubmit(values, setError);
        },
    });
    return {
        error,
        form,
    };
}

export type FormProps<V extends FormikValues> = {
    submitLabel: string;
    form: FormDefinition<V>;
    items: { [key in keyof V]: FormItem };
};

export default function Form<V extends FormikValues>(props: FormProps<V>): JSX.Element {
    const { submitLabel, form: formik, items } = props;
    const { form, error } = formik;

    return (
        <>
            <form onSubmit={form.handleSubmit}>
                <div className="card-body">
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    {Object.entries(items).map(([key, item]) => {
                        const className = 'form-control';

                        return (
                            <div className="col-xs-12" key={key}>
                                <div className="form-group">
                                    <label className={item.required ? 'required' : ''}>{item.label}</label>

                                    {item.input({
                                        className,
                                        name: key,
                                        required: item.required,
                                        onChange: form.handleChange,
                                        value: form.values[key as keyof typeof form.values],
                                    })}

                                    {form.errors[key] as string}
                                    {form.errors[key] && (
                                        <div className="invalid-feedback">{form.errors[key] as string}</div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="card-footer">
                    <div className="form-group">
                        <div className="float-right">
                            {form.isSubmitting ? (
                                <div>submitting</div>
                            ) : (
                                <input type="submit" className="btn btn-lg bg-navy" value={submitLabel} />
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}
