using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Health.API.Data;
using Health.API.Models.Domain;
using Health.API.Models.DTO.Doctors;

namespace Health.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment environment;
        private readonly IHttpContextAccessor accessor;

        public DoctorController(ApplicationDbContext context,
            IWebHostEnvironment environment, IHttpContextAccessor accessor)
        {
            _context = context;
            this.environment = environment;
            this.accessor = accessor;
        }

        // GET: api/Doctor
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Doctor>>> GetDoctorProfiles()
        {
            return await _context.Doctors.ToListAsync();
        }

        // GET: api/Doctor/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Doctor>> GetDoctorProfile(Guid id)
        {
            var doctorProfile = await _context.Doctors.FindAsync(id);

            if (doctorProfile == null)
            {
                return NotFound();
            }

            return doctorProfile;
        }

        // PUT: api/Doctor/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDoctorProfile(Guid id, [FromForm] DoctorUpdateDto request)
        {
            var existingDoctor = await _context.Doctors.FindAsync(id);
            if (existingDoctor == null)
            {
                return NotFound();
            }

            existingDoctor.DoctorName = request.DoctorName;
            existingDoctor.Specialization = request.Specialization;
            existingDoctor.Hospital = request.Hospital;
            existingDoctor.Age = request.Age;

            if (request.Image != null)
            {
                if (!string.IsNullOrEmpty(existingDoctor.ImagePath))
                    DeleteFileFromDisk(existingDoctor.ImagePath);
                existingDoctor.ImagePath = await SaveFileToDisk(request.Image);
            }

            _context.Doctors.Update(existingDoctor);
            await _context.SaveChangesAsync();

            var response = new DoctorDto
            {
                Id = existingDoctor.Id,
                DoctorName = existingDoctor.DoctorName,
                Specialization = existingDoctor.Specialization,
                Age = existingDoctor.Age,
                Hospital = existingDoctor.Hospital,
                ImagePath = existingDoctor.ImagePath
            };
            return Ok(response);

            //try
            //{
            //    await _context.SaveChangesAsync();
            //}
            //catch (DbUpdateConcurrencyException)
            //{
            //    if (!DoctorProfileExists(id))
            //    {
            //        return NotFound();
            //    }
            //    else
            //    {
            //        throw;
            //    }
            //}

            //return NoContent();
        }

        // POST: api/Doctor
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Doctor>> PostDoctorProfile([FromForm] DoctorCreateDto request)
        {
            var doctor = new Doctor 
            {
                DoctorName = request.DoctorName,
                Age = request.Age,
                Specialization = request.Specialization,
                Hospital = request.Hospital,
            };

            if (request.Image != null) 
            {
                doctor.ImagePath = await SaveFileToDisk(request.Image);
            }
            _context.Doctors.Add(doctor);
            await _context.SaveChangesAsync();

            var response = new DoctorDto 
            {
                Id = doctor.Id,
                DoctorName = doctor.DoctorName,
                Age = doctor.Age,
                Specialization = doctor.Specialization,
                Hospital = doctor.Hospital,
                ImagePath = doctor.ImagePath,
                Patients = doctor.Patients,
            };

            return CreatedAtAction("GetDoctorProfile", new { id = doctor.Id }, response);
        }

        // DELETE: api/Doctor/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDoctorProfile(Guid id)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null)
            {
                return NotFound();
            }

            DeleteFileFromDisk(doctor.ImagePath);
            _context.Doctors.Remove(doctor);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DoctorProfileExists(Guid id)
        {
            return _context.Doctors.Any(e => e.Id == id);
        }

        private async Task<string> SaveFileToDisk(IFormFile file)
        {
            var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";
            //var hostUrl = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";
            var filePath = this.environment.WebRootPath + "\\Doctors\\" + uniqueFileName;

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            var hostUrl = $"{accessor.HttpContext!.Request.Scheme}://{accessor.HttpContext.Request.Host}{accessor.HttpContext.Request.PathBase}";
            var imagePath = hostUrl + "/Doctors/" + uniqueFileName;

            return imagePath;
        }

        private void DeleteFileFromDisk(string fileUrl)
        {
            var fileName = Path.GetFileName(fileUrl);
            var filePath = Path.Combine(this.environment.WebRootPath, "Doctors", fileName);
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }

        }
    }
}
