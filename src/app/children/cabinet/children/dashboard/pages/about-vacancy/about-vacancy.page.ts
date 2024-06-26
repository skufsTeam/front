import { ChangeDetectionStrategy, Component, Inject, Injector, inject } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BehaviorSubject, Observable, map, switchMap, takeUntil, tap } from 'rxjs';
import { DestroyService } from '../../../../../../services/destroy.service';
import { IVacancyCard, IVacancyCardRequest } from '../../../../interfaces/vacancy-card.interface';
import { RemoveVacancyModalComponent } from '../../components/remove-vacancy-modal/remove-vacancy-modal.component';
import { RequestVacancyService } from '../../services/request-vacancy.service';

@Component({
    templateUrl: './about-vacancy.page.html',
    styleUrls: ['./styles/about-vacancy.page.scss'],
    providers: [
        DestroyService
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutVacancyPage {

    public vacancyCard$: Observable<IVacancyCard>;
    public currentVacancy$: BehaviorSubject<IVacancyCardRequest | null> = new BehaviorSubject<IVacancyCardRequest | null>(null);

    private _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
    private _requestVacancyService: RequestVacancyService = inject(RequestVacancyService);

    constructor(
        @Inject(TuiDialogService) public readonly dialogs: TuiDialogService,
        @Inject(Injector) private readonly injector: Injector,
        @Inject(DestroyService) private readonly _destroy$: DestroyService
    ) {
        this.vacancyCard$ = this._activatedRoute.params
            .pipe(
                switchMap((params: Params) => {
                    return this._requestVacancyService.getVacancyById(params['id'])
                        .pipe(
                            tap((data: IVacancyCardRequest) => {
                                this.currentVacancy$.next(data);
                            })
                        );
                }),
            );
    }

    public openDialogRemove(vacancy: IVacancyCard): void {
        this.dialogs.open(new PolymorpheusComponent(RemoveVacancyModalComponent, this.injector), { size: 'auto', data: { vacancy: vacancy, type: 'about' } })
            .pipe(
                takeUntil(this._destroy$)
            )
            .subscribe();
    }

    public goToBack(): void {
        history.back();
    }
}
