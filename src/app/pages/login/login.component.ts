import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { ToastController } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { IonContent, IonInput, IonButton } from "@ionic/angular/standalone";
@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonContent, IonInput, IonButton],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastController: ToastController
  ) {
    this.form = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  async onLogin() {
    if (this.form.valid) {
      const { username, password } = this.form.value;
      if (username === "admin" && password === "1234") {
        await this.showToast("Login successful!");
        this.router.navigate(["/dashboard"]);
      } else {
        await this.showToast("Invalid credentials");
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: "top",
      color: "success",
    });
    await toast.present();
  }
}
