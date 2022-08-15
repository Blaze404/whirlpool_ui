import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MainService } from '../main.service';
import {FormControl} from '@angular/forms';
import {ConnectableObservable, Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';




export interface PeriodicElement {
  name: string;
  item: string;
  quantity: number;
  days: number;
  action: string;
  part_number: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {item: '1', part_number: "y27h7b9", name: 'Hydrogen', quantity: 1.0079, action: 'H', days: 1},
  {item: '2', part_number: "y27h7b9", name: 'Helium', quantity: 4.0026, action: 'He', days: 1},
  {item: '3', part_number: "y27h7b9", name: 'Lithium', quantity: 6.941, action: 'Li', days: 1},
  {item: '4', part_number: "y27h7b9", name: 'Beryllium', quantity: 9.0122, action: 'Be', days: 1},
  {item: '5', part_number: "y27h7b9", name: 'Boron', quantity: 10.811, action: 'B', days: 1},
  {item: '6', part_number: "y27h7b9", name: 'Carbon', quantity: 12.0107, action: 'C', days: 1},
  {item: '7', part_number: "y27h7b9", name: 'Nitrogen', quantity: 14.0067, action: 'N', days: 1},
  {item: '8', part_number: "y27h7b9", name: 'Oxygen', quantity: 15.9994, action: 'O', days: 1},
  {item: '9', part_number: "y27h7b9", name: 'Fluorine', quantity: 18.9984, action: 'F', days: 1}
];


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  animal: string = '';
  name: string = '';
  dashboard_data: any[] = [];
  unique_names: any = [];
  groups: any = {};
  employee_names: any = [];

  table_data: PeriodicElement[] = [];

  displayedColumns: string[] = ['name', 'item', 'part_number', 'quantity', 'days', 'action'];
  dataSource = new MatTableDataSource(this.table_data);

  constructor(public dialog: MatDialog, private mainService: MainService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {

    this.refresh_dashboard();

  }


  refresh_dashboard(){

    this.table_data = [];
    this.dataSource.data = this.table_data;

    this.mainService.dashboard().subscribe(resp => {
      var resp2: any = resp;
      this.dashboard_data = resp2;
    
      // console.log(this.dashboard_data);
      for(var i=0; i<resp2['names'].length; i++){
        this.unique_names.push(resp2['names'][i]['name']);
      }

      for(const k in resp2['groups']){
        var temp = [];

        for(var i=0; i<resp2['groups'][k].length; i++){
          temp.push(resp2['groups'][k][i]['part_number']);
        }

        this.groups[k] = temp;

      }
      this.employee_names = resp2['employees'];
      // console.log("groups", this.groups);

      for( var i=0; i<resp2.data.length; i++){
        var row = resp2.data[i]
        var nnnee = {name: row['name'], item: row['inventory'], part_number: row['part_number'],
                    quantity:  parseFloat(row["quantity"]), action: "Return", days: parseInt(row["days"])  }
        // console.log(nnnee);
          this.table_data.push(nnnee);
          this.dataSource.data = this.table_data;
      }

      console.log(resp2.data);

    });

  }
 

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddItemPopupDialog, {
      width: '500px',
      height: '500px',
      data: {unique_names: this.unique_names, groups: this.groups, employee_names: this.employee_names},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
      // console.log(result);
      if (result){
        var name = result.selected_employee;
        var item = result.selected_item;
        var selected_part_number = result.selected_part_number;
        var quantity = result.selected_quantity;

        this.mainService.add_transaction(name, item, selected_part_number, quantity).subscribe(resp => {
           var resp2: any = resp;
           if(resp2.success){
            this.openSnackBar("Successfully Added!", "close");
            this.refresh_dashboard();

           }
           else{
            this.openSnackBar("Something went wrong. Please try again", "close");
           }
        })

        
      }
    });
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  returnItem(event: any){

    var ind = parseInt(event);
    var record = this.dataSource.filteredData[ind];

    var name = record.name;
    var item = record.item;
    var part_number = record.part_number;
    var available_quantity = record.quantity;
    

    // console.log(record);

    const dialogRef = this.dialog.open(ReturnItemPopupDialog, {
      width: '500px',
      height: '600px',
      data: {name: name, item: item, part_number: part_number, available_quantity: available_quantity},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
      // console.log(result);

      var name = result.name;
      var item = result.item;
      var part_number = result.part_number;
      var quantity = result.quantity;
      var not_working = result.not_working;

      this.mainService.remove_transaction(name, item, part_number, quantity, not_working).subscribe(resp => {
          var resp2: any = resp;
          console.log(resp2);
          if(resp2.success){
            this.openSnackBar("Successfully Added!", "close");
            this.refresh_dashboard();
          }
          else{
            this.openSnackBar("Something went wrong. Please try again", "close");
           }
      });
      
    });

  }

}



@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './add_element_popup.html',
  styleUrls: ['./add_element_popup.css', "../../../node_modules/@ng-select/ng-select/themes/material.theme.css",]
})

export class AddItemPopupDialog {

  options = ['Select Option'];
  part_number_options = [];
  filteredOptions: string[]|null = null;
  selected_name: number = 0;
  // selected_part_number: number = 0;
  employees: any = [];

  selected_employee: string = '';
  selected_item: string = '';
  selected_part_number: string = '';
  selected_quantity: number = 0;
  selected_part_number_value: string = '';


  available_quantity: string ='';

  constructor(
    public dialogRef: MatDialogRef<AddItemPopupDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private mainService: MainService
  ) {}

  ngOnInit(){
    // console.log(this.data['unique_names'])
    for( var i=0; i< this.data['unique_names'].length; i++){
      this.options.push(  this.data['unique_names'][i]  )
    };
    // console.log(this.options);
    this.employees = this.data.employee_names;
    this.filteredOptions = this.options;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  item_name_filter(event: any){
    // console.log(event);
    var val = event.target.value;
    // alert(val);
    this.filteredOptions = this._filter(val);
  }


  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }


  item_value_change(event: any){

    this.selected_part_number_value = '';
    
    var selected_item = this.filteredOptions![event];
    this.part_number_options = this.data.groups[selected_item];
    
    this.selected_item = selected_item;
  }


  part_number_change(event: any){
      var selected_part = this.part_number_options![event];
      this.selected_part_number = selected_part;
      // console.log("here");

      this.mainService.current_quantity(this.selected_item, this.selected_part_number).subscribe(resp => {
          var resp2: any = resp;
          // console.log(resp2);
          if (resp2['success']){
            // alert(resp2["quantity"]);
            this.available_quantity = "Available: " + resp2["quantity"];
          }
          else{
            this.available_quantity = "Availablle: Could not fetch"
          }
      });
      
  }

  create_available_quantity(){
    // alert("yo")
      this.mainService.current_quantity(this.selected_item, this.selected_part_number).subscribe(resp => {
        var resp2: any = resp;
        // console.log(resp2);
        if (resp2['success']){
          // alert(resp2["quantity"]);
          this.available_quantity = "Available: " + resp2["quantity"];
        }
        else{
          this.available_quantity = "Availablle: Could not fetch"
        }
    });

  }

  employee_change(event: any){
    var selected_employee = this.employees![event];
    this.selected_employee = selected_employee;
  }

  clear(){
    this.part_number_options = [];
  }
 

  sendData(){

    return {
      selected_employee: this.selected_employee,
      selected_item: this.selected_item,
      selected_part_number: this.selected_part_number,
      selected_quantity: this.selected_quantity
    }

  }


  
}




@Component({
  selector: 'return-item-dialog',
  templateUrl: './return_element_popup.html',
  styleUrls: ['./return_element_popup.css', "../../../node_modules/@ng-select/ng-select/themes/material.theme.css",]
})

export class ReturnItemPopupDialog {

  name: string = '';
  part_number: string = '';
  quantity: string = '';
  item: string = '';
  available: string = '';
  working: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ReturnItemPopupDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private mainService: MainService
  ) {}

  ngOnInit(){ 
    this.name = this.data.name;
    this.item = this.data.item;
    this.part_number = this.data.part_number;
    this.available = "Max: " + this.data.available_quantity;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  sendData(){

    return {name: this.name, part_number: this.part_number, item: this.item, quantity: this.quantity, not_working: this.working}
  }

}



