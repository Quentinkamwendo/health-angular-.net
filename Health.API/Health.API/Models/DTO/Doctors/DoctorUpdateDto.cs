using Health.API.Models.Domain;

namespace Health.API.Models.DTO.Doctors
{
    public class DoctorUpdateDto
    {
        public Guid Id { get; set; }
        public string DoctorName { get; set; }
        public int Age { get; set; }
        public string Specialization { get; set; }
        public IFormFile Image { get; set; }
        public ICollection<Patient> Patients { get; set; } = new List<Patient>();
        public string Hospital { get; set; }
    }
}
