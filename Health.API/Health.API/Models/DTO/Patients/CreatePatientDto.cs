namespace Health.API.Models.DTO.Patients
{
    public class CreatePatientDto
    {
        public string PatientName { get; set; }
        public string Residence { get; set; }
        public DateTime TreatmentDate { get; set; }
        public string Disease { get; set; }
        public int Age { get; set; }
        public IFormFile Image { get; set; }
        public Guid DoctorId { get; set; }
    }
}
