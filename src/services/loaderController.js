let loaderState = {
    loading: false,
    listners: []
};

export const loaderController = {
    show: () => {
        loaderState.loading = true;
        loaderState.listners.forEach((listener) => listener(true));
    },

    hide: () => {
      loaderState.loading = false;
      loaderState.listners.forEach((listener) => listener(false));  
    },

    subscribe: (listener) => {
        loaderState.listeners.push(listener);
        return () => {
            loaderState.listners = loaderState.listners.filter((l) =>l !== listener)
        };
    },
};