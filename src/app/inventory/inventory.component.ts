import { Component, OnInit, Inject } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MainService } from '../main.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';



export interface InventoryElement {
  name: string;
  quantity: number;
  current_quantity: number;
  damage_quantity: number;
  part_number: string;
}


@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  table_data: InventoryElement[] = [];

  displayedColumns: string[] = ['name', 'part_number', 'quantity', 'current_quantity', 'damage_quantity'];
  dataSource = new MatTableDataSource(this.table_data);

  constructor(private mainService: MainService, public dialog: MatDialog, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.refresh();
    

  }

  refresh(){
    this.mainService.inventory().subscribe(resp => {
      var resp2: any = resp;
      console.log(resp2);

      for(var i=0; i< resp2.data.length; i++){
        var row = resp2.data[i];

        var nnew = { name: row['name'], part_number: row['part_number'], quantity: row['quantity'],
                      current_quantity: row['current_quantity'], damage_quantity: row['current_non_working_quantity'] }

                      this.table_data.push(nnew);
      }
      
      this.dataSource.data = this.table_data;

    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  
  openDialog(): void {
    const dialogRef = this.dialog.open(AddInventoryPopupDialog, {
      width: '500px',
      height: '500px',
      data: {unique_names: this.table_data},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
      // console.log(result);
      if(result){

        var name = result.name;
        var part_number = result.part_number;
        var quantity = result.quantity;

        this.mainService.add_inventory(name, part_number, quantity).subscribe(resp => {
          var resp2: any = resp;
            if(resp2.success){
              this.openSnackBar("Successfully Added!", "close");
              this.refresh();
            }
            else{
              this.openSnackBar("Something went wrong, please try again", "close");
            }
        });

      }
     
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  openDialogRemove(){
    
  }


}




@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './add_element_popup.html',
  styleUrls: ['./add_element_popup.css', "../../../node_modules/@ng-select/ng-select/themes/material.theme.css",]
})

export class AddInventoryPopupDialog {

  name: string = '';
  part_number: string = '';
  quantity: string = '';

  constructor(
    public dialogRef: MatDialogRef<AddInventoryPopupDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private mainService: MainService
  ) {}

  ngOnInit(){ 
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  sendData(){
    return {name: this.name, part_number: this.part_number, quantity: this.quantity}
  }

}

