import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  onLogin() {
    if (this.form.valid) {
      const { username, password } = this.form.value;
      if (username === "admin" && password === "1234") {
        // alert("Login successful!");
        this.router.navigate(["/dashboard"]);
      } else {
        alert("Invalid credentials");
      }
    } else {
      this.form.markAllAsTouched();
    }
  }
}
