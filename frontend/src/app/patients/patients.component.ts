import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { FileUploadEvent } from 'primeng/fileupload';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css'
})
export class PatientsComponent {
  patientForm!: FormGroup;
  uploadedFiles: any[] = [];
  constructor(private messageService: MessageService, private fb: FormBuilder) {
    this.patientForm = this.fb.group({
      patientName: ['', Validators.required],
      location: ['', Validators.required]
    })
  }
  items: MenuItem[] | undefined;
  // ngOnInit(): void {
  //   this.items = [
  //     {
  //       label: 'Update',
  //       icon: 'pi pi-refresh'
  //     },
  //     {
  //       label: 'Delete',
  //       icon: 'pi pi-times'
  //     }
  //   ]
  // }

  onUpload(event: FileUploadEvent) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
  }

}
