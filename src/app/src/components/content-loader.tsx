import React from 'react';
import type { ClientResponse } from '../client/client';

function Loader(): JSX.Element {
    return <>Loading...</>;
}

type LoaderState<D> =
    | {
          state: 'uninitialized';
      }
    | {
          state: 'loading';
      }
    | {
          state: 'loaded';
          data: D;
      }
    | {
          state: 'error';
          status: number;
          error: string;
      };

function useLoaderState<T>() {
    return React.useState<LoaderState<T>>({ state: 'uninitialized' });
}

type ContentLoaderProps<T, E> = {
    defaultValue?: T;
    load: () => Promise<ClientResponse<E>>;
    render: (entry: E, showLoader: () => void, dataReload: () => void) => JSX.Element;
};

export default function ContentLoader<T, E>(props: ContentLoaderProps<T, E>): JSX.Element {
    const { load, render } = props;
    const [entry, setEntry] = useLoaderState<E>();

    const dataLoad = React.useCallback(() => {
        load()
            .then(value => {
                if (value.success) {
                    setEntry({ state: 'loaded', data: value.data });
                } else {
                    setEntry({ state: 'error', status: value.status, error: value.error });
                }
            })
            .catch(e => {
                setEntry({ state: 'error', status: 500, error: e.message });
            });
    }, [load, setEntry]);

    const showLoader = React.useCallback(() => {
        setEntry({ state: 'loading' });
    }, [setEntry]);

    const dataReload = React.useCallback(() => {
        setEntry({ state: 'loading' });
        dataLoad();
    }, [dataLoad, setEntry]);

    React.useEffect(() => {
        setEntry({ state: 'loading' });
        dataLoad();
    }, [dataLoad, props.defaultValue, setEntry]);

    if (entry.state === 'uninitialized' || entry.state === 'loading') {
        return <Loader />;
    }

    if (entry.state === 'error') {
        return (
            <div className="alert alert-danger">
                <h5>
                    {'Error'} {entry.status}
                </h5>
                <p>{entry.error}</p>
            </div>
        );
    }

    return render(entry.data, showLoader, dataReload);
}
