import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadViewDialog } from './read-view-dialog';

describe('ReadViewDialog', () => {
  let component: ReadViewDialog;
  let fixture: ComponentFixture<ReadViewDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReadViewDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadViewDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
