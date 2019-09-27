import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Todo} from '../models/todo';
import {TodoServiceService} from '../services/todo-service.service';
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator} from '@angular/material';


@Component({
    selector: 'app-todo-list',
    templateUrl: './todo-list.component.html',
    styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
    public displayedColumns: string[] = ['id', 'select', 'title', 'start', 'deadline', 'delete'];
    public todos: Todo[] = [];
    public dataSource: MatTableDataSource<any>;
    public selection = new SelectionModel<Todo>(true, []);
    public isFirstGetingOfTodos = true;

    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    constructor(private todoService: TodoServiceService) {
    }

    public ngOnInit(): void {
        this.todoService.todoTransition.subscribe(todo => {
            this.todos.push(todo);
            this.checkActuality();
            this.updateTable();
            if (todo.id !== 0) {
                this.todoService.updateTodos(this.todos);
            }
        });
        if (this.isFirstGetingOfTodos) {
            this.todos = this.todoService.getTodos();
            this.checkActuality();
            this.updateTable();
            this.todoService.updateTodos(this.todos);
            this.isFirstGetingOfTodos = false;
        }
    }

    private updateTable(): void {
        this.dataSource = new MatTableDataSource(this.todos);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.todos.forEach(todo => {
            if (todo.completed) {
                this.selection.select(todo);
            }
        });
    }

    private checkActuality(): void {
        this.todos = this.todos.map(todo => {
            const actuatily = new Date() < todo.deadline;
            return {...todo, isActual: actuatily};
        });
    }

    public complete(element?: Todo, selectAll?: boolean): void {
        this.todos.map(todo => {
            if (selectAll) {
                if (!this.isAllSelected()) {
                    todo.completed = true;
                } else {
                    todo.completed = false;
                }
            } else {
                if (element.completed) {
                    if (todo.id === element.id) {
                        todo.completed = false;
                        this.selection.deselect(todo);
                    }
                } else {
                    if (todo.id === element.id) {
                        todo.completed = true;
                        this.selection.select(todo);
                    }
                }
            }
        });
        this.todoService.updateTodos(this.todos);
    }

    public delete(element: Todo) {
        this.todos = this.todos.filter(todo => todo.id !== element.id);
        this.todoService.updateTodos(this.todos);
        this.updateTable();
    }

    public isAllSelected(): boolean {
        if (this.dataSource) {
            const numSelected = this.selection.selected.length;
            const numRows = this.dataSource.data.length;
            return numSelected === numRows;
        }
    }

    public masterToggle(): void {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

    public checkboxLabel(row?: Todo): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
    }

}
