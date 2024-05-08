﻿using Health.API.Data;
using Health.API.Models.Domain;
using Health.API.Models.DTO.Patients;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Health.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;
        private readonly IWebHostEnvironment environment;

        public PatientController(ApplicationDbContext dbContext, IWebHostEnvironment environment)
        {
            this.dbContext = dbContext;
            this.environment = environment;
        }

        [HttpPost]
        public async Task<IActionResult> CreatePatient([FromForm] CreatePatientDto request) 
        {
            var doctor = dbContext.Doctors.Find(request.DoctorId);

            if (doctor == null)
            {
                return BadRequest("Doctor not found.");
            }

            var patient = new Patient
            {
                Age = request.Age,
                Disease = request.Disease,
                TreatmentDate = request.TreatmentDate,
                PatientName = request.PatientName,
                Residence = request.Residence,
                DoctorId = request.DoctorId,
                Doctor = doctor
            };

            if (request.Image != null) 
            {
                patient.ImagePath = await SaveFileToDisk(request.Image);
            }

            dbContext.Patients.Add(patient);
            await dbContext.SaveChangesAsync();

            var response = new PatientDto
            {
                Id = patient.Id,
                Age = patient.Age,
                Disease = patient.Disease,
                TreatmentDate = patient.TreatmentDate,
                PatientName = patient.PatientName,
                Residence = patient.Residence,
                ImagePath = patient.ImagePath,
                Doctor = patient.Doctor,
                //DoctorId = patient.DoctorId
            };

            return CreatedAtAction(nameof(GetPatient), new { id = patient.Id }, response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePatient(Guid id, [FromForm] CreatePatientDto request) 
        {
            var existingPatient = await dbContext.Patients.FindAsync(id);
            if(existingPatient == null) 
            {
                return NotFound();
            }
            
            existingPatient.Age = request.Age;
            existingPatient.Disease = request.Disease;
            existingPatient.TreatmentDate = request.TreatmentDate;
            existingPatient.PatientName = request.PatientName;
            existingPatient.Residence = request.Residence;

            if (request.Image != null)
            {
                if (!string.IsNullOrEmpty(existingPatient.ImagePath))
                    DeleteFileFromDisk(existingPatient.ImagePath);
                existingPatient.ImagePath = await SaveFileToDisk(request.Image);
            }

          
            dbContext.Patients.Update(existingPatient);
            await dbContext.SaveChangesAsync();

            var response = new PatientDto
            {
                //Id = existingPatient.Id,
                Age = existingPatient.Age,
                Disease = existingPatient.Disease,
                TreatmentDate = existingPatient.TreatmentDate,
                PatientName = existingPatient.PatientName,
                Residence = existingPatient.Residence
            };

            return Ok(response);
        }

        [HttpGet]
        public async Task<ActionResult> GetPatients() 
        {
            var response = await dbContext.Patients.ToListAsync();
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetPatient(Guid id) 
        { 
            var patient = await dbContext.Patients.FindAsync(id);
            return Ok(patient);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePatient(Guid id) 
        {
            var patient = await dbContext.Patients.FindAsync(id);
            if(patient != null) 
            {
                DeleteFileFromDisk(patient.ImagePath);
                dbContext.Patients.Remove(patient);
                await dbContext.SaveChangesAsync();
                return NoContent();
            }
            
            return NotFound();
        }

        private async Task<string> SaveFileToDisk(IFormFile file) 
        {
            var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";
            var hostUrl = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";
            var filePath = this.environment.WebRootPath + "\\Patients\\" + uniqueFileName;
            var imagePath = hostUrl + "/Patients/" + uniqueFileName;

            using (var fileStream = new FileStream(filePath, FileMode.Create)) 
            {
                await file.CopyToAsync(fileStream);
            }

            return imagePath;
        }

        private void DeleteFileFromDisk(string fileUrl) 
        {
            var fileName = Path.GetFileName(fileUrl);
            var filePath = Path.Combine(this.environment.WebRootPath, "Patients", fileName);
            if (System.IO.File.Exists(filePath)) 
            {
                System.IO.File.Delete(filePath);
            }        
                
        }
    }
}