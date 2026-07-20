
export interface ResponseGet<T> {
    data: T;
    status: number;
    message: string;
}

export interface ResponsePPD {
    status: number;
    message: string;
}
  
export interface ErrorExcep {
    status: number;
    message: string;
}
  