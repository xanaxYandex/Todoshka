import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TodoServiceService} from '../services/todo-service.service';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

@Component({
    selector: 'app-todo-create',
    templateUrl: './todo-create.component.html',
    styleUrls: ['./todo-create.component.scss'],
    providers: [{
        provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
    }]
})
export class TodoCreateComponent implements OnInit {
    public isLinear = false;
    public firstFormGroup: FormGroup;
    public secondFormGroup: FormGroup;
    private lastTodoId: number;
    @ViewChild('stepper', {static: false}) stepper;

    constructor(private formBuilder: FormBuilder, private todoService: TodoServiceService) {
    }

    public ngOnInit(): void {
        this.firstFormGroup = this.formBuilder.group({
            firstCtrl: ['', Validators.required]
        });
        this.secondFormGroup = this.formBuilder.group({
            secondCtrl: ['', Validators.required],
            thirdCtrl: ['', Validators.required]
        });
    }

    public createTodo(): void {
        const todos = this.todoService.getTodos();
        console.log(todos);
        if (todos.length > 0) {
            this.lastTodoId = todos[todos.length - 1].id;
        } else {
            this.lastTodoId = 0;
        }
        this.todoService.todoTransition.next({
            id: this.lastTodoId + 1,
            title: this.firstFormGroup.value['firstCtrl'],
            start: this.secondFormGroup.value['secondCtrl'],
            deadline: this.secondFormGroup.value['thirdCtrl'],
            completed: false,
        });
        setTimeout(() => {
            this.stepper.reset();
        }, 2000);
    }

}
