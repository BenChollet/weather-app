export type IResponse<S, E = Error> =
    | {
    success: S;
    error: null;
}
    | {
    success: null;
    error: E;
};