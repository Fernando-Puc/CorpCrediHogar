export abstract class Mapper<T, U> {
  abstract from(entity: T): U
  abstract to(entity: U): T
}
