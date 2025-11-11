import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';

// Firebase Modular SDK
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideAuth, getAuth } from '@angular/fire/auth';

// App files
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';
import { App } from './app';
import { Registration } from './pages/registration/registration';
import { Events } from './pages/events/events';
import { Gallery } from './pages/gallery/gallery';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { EventCreate } from './pages/event-create/event-create';
import { Navbar } from './navbar/navbar';
import { Parallax } from './parallax';
import { ReadViewDialog } from './pages/gallery/read-view-dialog/read-view-dialog';

import { ToastrModule } from 'ngx-toastr';
import { Docs } from './pages/docs/docs';
import { SafePdfPipe } from './core/safe-pdf-pipe';

@NgModule({
  declarations: [
    App,
    Registration,
    Events,
    Gallery,
    AdminDashboard,
    Home,
    Login,
    EventCreate,
    Navbar,
    Parallax,
    ReadViewDialog,
    Docs,
    SafePdfPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,

    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatListModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,

    ToastrModule.forRoot({
      timeOut: 5000,
      closeButton: true,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }), // ToastrModule added

   // Firebase
  //  AngularFireModule.initializeApp(environment.firebase), // ← correct initialization
  //  AngularFirestoreModule,
  //  AngularFireStorageModule,
  //  AngularFireAuthModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ],
  bootstrap: [App]
})
export class AppModule { }
