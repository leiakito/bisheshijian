package com.propertymgmt.property.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;

@Entity
@Table(name = "property_units")
public class PropertyUnit extends BaseEntity {

    public enum UnitStatus {
        OCCUPIED,
        VACANT,
        UNDER_MAINTENANCE
    }

    @Column(nullable = false, length = 50)
    private String building;

    @Column(nullable = false, length = 50)
    private String unit;

    @Column(name = "room_number", nullable = false, length = 50)
    private String roomNumber;

    @Column(length = 20)
    private String area;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private UnitStatus status = UnitStatus.VACANT;

    @Column(name = "parking_space", length = 50)
    private String parkingSpace;

    @Column(name = "owner_name", length = 50)
    private String ownerName;

    public String getBuilding() {
        return building;
    }

    public void setBuilding(String building) {
        this.building = building;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public UnitStatus getStatus() {
        return status;
    }

    public void setStatus(UnitStatus status) {
        this.status = status;
    }

    public String getParkingSpace() {
        return parkingSpace;
    }

    public void setParkingSpace(String parkingSpace) {
        this.parkingSpace = parkingSpace;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }
}
