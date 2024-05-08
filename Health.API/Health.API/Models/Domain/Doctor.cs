﻿using System.Text.Json.Serialization;

namespace Health.API.Models.Domain
{
    public class Doctor
    {
        public Guid Id { get; set; }
        public string DoctorName { get; set; }
        public int Age { get; set; }
        public string Specialization { get; set; }
        public string ImagePath { get; set; }
        [JsonIgnore]
        public ICollection<Patient> Patients { get; set; } = new List<Patient>();
        public string Hospital { get; set; }
    }
}