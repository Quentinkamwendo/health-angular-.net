using Health.API.Models.Domain;

namespace Health.API.Models.DTO.Patients
{
    public class PatientDto
    {
        public Guid Id { get; set; }
        public string PatientName { get; set; }
        public string Residence { get; set; }
        public DateTime TreatmentDate { get; set; }
        public string Disease { get; set; }
        public int Age { get; set; }
        public string ImagePath { get; set; }
        public Guid DoctorId { get; set; }
        public Doctor Doctor { get; set; }
    }
}
