export type ListType = {
    _id: string,
    title: string,
    description: string,
    done: boolean
};

export type PropsItem = {
    data: {
        _id: string,
        title: string,
        description: string,
        done: boolean
    },
    onDone: ( _id: string, done: boolean, title: string ) => void,
    onDelete: ( id: string ) => void,
}
