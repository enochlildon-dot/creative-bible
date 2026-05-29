package com.creativebible.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.UUID;

@Document(collection = "records")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Record {
    @Id
    private String _id;
    public String type;
    public Integer phase_index;
    public Integer section_index;
    public String title;
    public String body;
    public String link_url;
    public String notes;

    public Record() {
        this._id = UUID.randomUUID().toString();
    }

    // Getters and setters
    public String get_id() { return _id; }
    public void set_id(String _id) { this._id = _id; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Integer getPhase_index() { return phase_index; }
    public void setPhase_index(Integer phase_index) { this.phase_index = phase_index; }
    public Integer getSection_index() { return section_index; }
    public void setSection_index(Integer section_index) { this.section_index = section_index; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }
    public String getLink_url() { return link_url; }
    public void setLink_url(String link_url) { this.link_url = link_url; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
