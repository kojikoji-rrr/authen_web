import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { AuthenApiService } from "./services/authen-api.service";

@Component({
  selector: 'app-authen',
  imports: [CommonModule],
  templateUrl: './authen.component.html',
  styleUrl: './authen.component.scss',
})
export class AuthenComponent implements OnInit {
  readonly apiBusy;

  constructor(private readonly api: AuthenApiService) {
    this.apiBusy = api.busy;
  }

  async ngOnInit(): Promise<void> {}
}
