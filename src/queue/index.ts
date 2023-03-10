import { Injectable } from '@nestjs/common';

@Injectable()
export class Queue<T> {
  array = [];

  get size() {
    return this.array.length;
  }

  // get array_() {
  //   return this.array;
  // }

  set setArray(array: T[]) {
    this.array = array;
  }
  /**
   * 작업의 우선순위를 기준으로 정렬
   */
  public jobSort() {
    this.array.sort((a, b) => a.order - b.order);
  }

  public enqueue(data: T) {
    this.array.push(data); // 배열에 요소를 추가한다
  }

  public dequeue(): T {
    return this.array.shift(); // 첫번째 요소를 반환하고 제거한다.
  }
}
