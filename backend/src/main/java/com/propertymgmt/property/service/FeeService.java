package com.propertymgmt.property.service;

import com.propertymgmt.property.model.FeeBill;
import java.util.List;

public interface FeeService {
    List<FeeBill> findAll();
}
