import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { UiCampusButtonComponent } from '../../../../../../ui';
import { ReactiveFormsModule } from '@angular/forms';
import { VacancyViewModel } from '../../view-model/vacancy.view-model';
import { RequestVacancyService } from '../../services/request-vacancy.service';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TuiDialogContext } from '@taiga-ui/core';
import { DestroyService } from '../../../../../../services/destroy.service';
import { takeUntil, tap } from 'rxjs';

@Component({
    standalone: true,
    templateUrl: './add-vacancy-modal.component.html',
    styleUrls: ['./styles/add-vacancy-modal.component.scss'],
    imports: [
        CommonModule,
        UiCampusButtonComponent,
        ReactiveFormsModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddVacancyModalComponent {

    public viewModel: VacancyViewModel = new VacancyViewModel();
    public employments: string[] = ['Полная занятость', 'Частичная занятость', 'Стажировка'];
    public experiences: string[] = ['Без опыта', 'Меньше 1 года', 'От 1 до 3 лет', 'Больше 3 лет'];

    private _requestVacancyService: RequestVacancyService = inject(RequestVacancyService);
    private _destroy$: DestroyService = inject(DestroyService);

    constructor(
        @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext,
    ) { }

    public onSubmit(): void {
        this._requestVacancyService.addVacancy(this.viewModel.toModel())
            .pipe(
                tap(() => this.closeModal()),
                tap(() => (this.context.data as any).update$.next()),
                takeUntil(this._destroy$),
            )
            .subscribe();
    }

    public closeModal(): void {
        this.context.$implicit.complete();
    }
}
