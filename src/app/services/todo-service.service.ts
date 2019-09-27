import {Injectable} from '@angular/core';
import {Todo} from '../models/todo';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TodoServiceService {
    public TODOS: Todo[] = [];
    public todoTransition: BehaviorSubject<Todo> = new BehaviorSubject<Todo>({
        id: 0,
        title: 'Create TODO',
        start: new Date(),
        deadline: new Date(),
        completed: false,
    });

    constructor(private http: HttpClient) {
    }

    public fetchTodos(): Observable<Todo[]> {
        return this.http.get<Todo[]>('https://jsonplaceholder.typicode.com/todos').pipe(
            map(todos => todos.map(todo => ({...todo, start: new Date(), deadline: new Date() })))
        );
    }

    public getTodos(): Todo[] {
        return this.TODOS;
    }

    public createTodo(todo: Todo): void {
        this.TODOS.push(todo);
    }

    public updateTodos(todos: Todo[]): void {
        this.TODOS = todos;
    }

}
