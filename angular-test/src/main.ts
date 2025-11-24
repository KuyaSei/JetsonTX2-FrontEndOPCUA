import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { HttpClientModule } from '@angular/common/http';


// Check for production mode manually since we removed environments file
if (false) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    // This enables HTTP and Ionic for the whole app
    importProvidersFrom(HttpClientModule),
  ]
}).catch(err => console.error(err));
