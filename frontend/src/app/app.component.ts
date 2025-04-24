import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="text-align: center; padding: 20px;">
      <h1>{{ message }}</h1>
      <div style="margin-top: 20px;">
        <h2>Chat con IA</h2>
        <div style="max-width: 500px; margin: 0 auto;">
          <input 
            [(ngModel)]="userMessage" 
            placeholder="Escribe tu mensaje..."
            style="width: 100%; padding: 10px; margin-bottom: 10px;"
          >
          <button 
            (click)="sendMessage()" 
            style="padding: 10px 20px;"
            [disabled]="isLoading"
          >
            {{ isLoading ? 'Enviando...' : 'Enviar' }}
          </button>
          <div *ngIf="chatResponse" style="margin-top: 20px; text-align: left; padding: 10px; background: #f5f5f5; border-radius: 5px;">
            <strong>Respuesta:</strong>
            <p>{{ chatResponse }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AppComponent {
  message = '';
  userMessage = '';
  chatResponse = '';
  isLoading = false;

  constructor(private http: HttpClient) {}

  getMessage() {
    this.http.get<{message: string}>('http://localhost:8000/')
      .subscribe(response => this.message = response.message);
  }

  sendMessage() {
    if (!this.userMessage.trim()) return;
    this.isLoading = true;
    this.http.post<{response: string}>('http://localhost:8000/query',
      { query: this.userMessage }
    ).subscribe({
      next: (response) => {
        this.chatResponse = response.response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.chatResponse = 'Error al procesar tu mensaje';
        this.isLoading = false;
      }
    });
  }
}
