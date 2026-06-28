export abstract class UseCase<P> {
  abstract execute(params: P): void
}
