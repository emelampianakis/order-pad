import { Component } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";

interface Table {
  id: number;
  name: string;
  user: string;
  price: number;
  status: "open" | "closed" | "reserved";
}

@Component({
  selector: "app-table-dashboard",
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: "./table-dashboard.component.html",
  styleUrls: ["./table-dashboard.component.scss"],
})
export class TableDashboardComponent {
  username = "Admin"; // You can replace with real user info

  filter: "all" | "open" | "closed" | "reserved" = "all";
  searchTerm = "";
  columns = 1;

  statuses = ["open", "closed", "reserved"];

  tables: Table[] = [
    {
      id: 1,
      name: "Table 1",
      status: "open",
      user: "Alice",
      price: 42.5,
    },
    {
      id: 2,
      name: "Table 2",
      status: "closed",
      user: "Bob",
      price: 0,
    },
    {
      id: 3,
      name: "Table 3",
      status: "reserved",
      user: "Chris",
      price: 125.0,
    },
    {
      id: 4,
      name: "Table 4",
      status: "open",
      user: "Dana",
      price: 68.9,
    },
    {
      id: 5,
      name: "Table 5",
      status: "closed",
      user: "Eve",
      price: 0,
    },
    {
      id: 6,
      name: "Table 6",
      status: "reserved",
      user: "Frank",
      price: 88.2,
    },
    {
      id: 4,
      name: "Table 4",
      status: "open",
      user: "Dana",
      price: 68.9,
    },
    {
      id: 5,
      name: "Table 5",
      status: "closed",
      user: "Eve",
      price: 0,
    },
    {
      id: 6,
      name: "Table 6",
      status: "reserved",
      user: "Frank",
      price: 88.2,
    },
    {
      id: 4,
      name: "Table 4",
      status: "open",
      user: "Dana",
      price: 68.9,
    },
    {
      id: 5,
      name: "Table 5",
      status: "closed",
      user: "Eve",
      price: 0,
    },
    {
      id: 6,
      name: "Table 6",
      status: "reserved",
      user: "Frank",
      price: 88.2,
    },
  ];

  constructor(private router: Router) {}

  get filteredTables(): Table[] {
    return this.tables
      .filter((t) => (this.filter === "all" ? true : t.status === this.filter))
      .filter((t) => t.name.toString().includes(this.searchTerm.trim()));
  }

  cycleColumns() {
    this.columns = this.columns === 3 ? 1 : this.columns + 1;
  }

  get currentIcon(): string {
    // Using existing valid ionicons
    switch (this.columns) {
      case 1:
        return "list-outline"; // 1 column
      case 2:
        return "grid-outline"; // 2 columns
      case 3:
        return "apps-outline"; // 3 columns
      default:
        return "list-outline";
    }
  }

  getStatusClasses(
    status: string,
    tableStatus: string
  ): { [klass: string]: boolean } {
    return {
      [status]: true,
      active: status === tableStatus,
    };
  }

  goToTableDetails(id: number) {
    this.router.navigate(["/table", id]);
  }
}
