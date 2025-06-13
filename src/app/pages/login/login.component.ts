import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import {
  IonContent,
  IonInput,
  IonButton,
  ToastController,
  LoadingController,
} from "@ionic/angular/standalone";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonContent, IonInput, IonButton],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastController: ToastController,
    private authService: AuthService,
    private loadingController: LoadingController
  ) {
    this.form = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  async onLogin() {
    if (this.form.valid) {
      this.loading = true;
      const { username, password } = this.form.value;

      const loading = await this.loadingController.create({
        message: "Logging in...",
      });
      await loading.present();

      this.authService.login({ username: username, password }).subscribe({
        next: async () => {
          await loading.dismiss();
          await this.showSuccessToast("Login successful!");
          this.router.navigate(["/dashboard"]);
        },
        error: async (err: any) => {
          console.error(err);
          await loading.dismiss();
          await this.showDangerToast("Login failed. Check your credentials.");
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  private async showDangerToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: "top",
      color: "danger",
    });
    await toast.present();
  }

  private async showSuccessToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: "top",
      color: "success",
    });
    await toast.present();
  }
}
